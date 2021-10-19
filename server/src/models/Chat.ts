import {model, Schema} from "mongoose";
import { messageSchema } from "./Message";

export const conversationSchema = new Schema({
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "message"
        }
    ]
})

export const Message = model("message", messageSchema)