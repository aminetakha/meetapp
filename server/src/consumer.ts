import amqp from "amqplib";
import { addMessage } from "./controllers/chat";

const consumer = async () => {
    try {
        const connection = await amqp.connect(process.env.AMQP_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("message");
        channel.consume("message",async  message => {
            const consumedMessage = JSON.parse(message.content.toString())
            await addMessage(consumedMessage.data)
            channel.ack(message)
        })
    } catch (err) {
        console.log(err)
    }
}

export default consumer;