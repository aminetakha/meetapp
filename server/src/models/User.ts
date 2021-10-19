import { model, Schema} from "mongoose"
import { conversationSchema } from "./Chat";

const userSchema = new Schema({
    providerId: String,
    username: String,
    birthdate: Date,
    country: String,
    gender: String,
    about: String,
    image: String,
    tokens: Number,
    pushToken: String,
    active: Boolean,
    stripeCustomerId: String,
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    requests: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    conversations: [
        {
            type: Schema.Types.ObjectId,
            ref: "conversation"
        }
    ]
})

export const User = model("user", userSchema);
export const Conversation = model("conversation", conversationSchema);