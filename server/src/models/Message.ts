import {Schema} from "mongoose"

export const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    message: String,
    duration: {
        type: Number,
        default: 0
    },
    type: String,
    timestamp: Date
})
