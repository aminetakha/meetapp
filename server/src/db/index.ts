import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("Connected successfully")   
    } catch (error) {
        console.log(error)
    }
}