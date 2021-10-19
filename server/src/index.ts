import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { connectDB } from "./db";
import { config } from "dotenv";
import appRoutes from "./routes"
import redis from "redis";
import { changeUserStatus } from "./controllers/user/user";
import publisher from "./publisher";
import consumer from "./consumer";
import { findUserById } from "./controllers/auth";

if(process.env.NODE_ENV !== "production"){
	config()
}

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
	cors: {
		origin: "*",
	},
	connectTimeout: 45000
});

const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD
})

app.use(cors());
app.use(express.json());
app.use(express.static("public/uploads"))

const main = async () => {
	await connectDB()
	const channel = await publisher();
	await consumer()
	app.use(appRoutes)
	let userId;

	io.on("connection", (socket: Socket) => {
		socket.on("currentUser", async data => {
			userId = data
			client.rpush(userId, socket.id)
			await changeUserStatus(true, userId)
		});

		socket.on("message", async data => {
			try {
				const theSender = await findUserById(userId);
				if(theSender.tokens <= 0){
					return;
				}
				client.lrange(data.receiver, 0, -1, (err, socketList) => {
					for(let sid of socketList){
						io.to(sid).emit("message", {
							...data,
							message: data.message.data,
							recordUri: data.message?.url ?? "",
						})
					}
				})
				if(data.type === "text"){
					const textMessage = {
						...data,
						duration: 0,
						message: data.message.data
					}
					channel.sendToQueue("message", Buffer.from(JSON.stringify({data: textMessage})))
				}else if(data.type === "voice"){
					const voiceMessage = {
						...data,
						message: data.message.url,
					}
					channel.sendToQueue("message", Buffer.from(JSON.stringify({data: voiceMessage})))
				}
			} catch (err) {
				console.log("SOCKETLIST IS UNDEFINED (NOT ITERABLE)")
			}
		})

		socket.on("disconnect", async () => {
			if(userId){
				await changeUserStatus(false, userId)
				client.del(userId)
				userId = null;
			}
		})
		
	});
	
	server.listen(PORT, () => {
		console.log("Server is up and running");
	});
}

main()