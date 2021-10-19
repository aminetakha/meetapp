import amqp from "amqplib";

const publisher = async () => {
    try {
        const connection = await amqp.connect(process.env.AMQP_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("message");
        return channel;
    } catch (err) {
        console.log(err)
    }
}

export default publisher;