import { Message } from "../../models/Chat";
import { Conversation, User } from "../../models/User";
import { MessageForm } from "../../types/MessageForm";
import { findUserById } from "../auth";
import { Expo } from 'expo-server-sdk';

/**
 * @param data contains sender (providerId of the sender) - receiver (providerId of the receiver) - message (the actual message)
 */
export const addMessage = async (data: MessageForm) => {
    let {sender, receiver, message, duration=0, type} = data;
    const theSender = await findUserById(sender);
    if(theSender.tokens > 0){
        const msg = await createMessage(sender, message, duration, type)
        await findOrCreateConversation(sender, receiver, msg);
        await User.findOneAndUpdate({_id: sender}, {$inc: {tokens: -1}});
        await sendMessageNotification(receiver, sender, message, type)
    }
}

export const createMessage = async (sender, message, duration, type) => {
    let msg = new Message({
        sender,
        message,
        duration, 
        type,
        timestamp: new Date()
    })
    msg = await msg.save();
    return msg;
}

export const findOrCreateConversation = async (sender, receiver, message) => {
    let conversation = await Conversation.findOne({
        members: { $all: [sender, receiver] }
    });

    let addConversation: boolean;

    if(conversation){
        conversation.messages.push(message.id)
        addConversation = false;
    }else{
        conversation = new Conversation({
            members: [sender, receiver],
            messages: [message.id]
        })
        addConversation = true;
    }

    conversation = await conversation.save();
    if(addConversation){
        await addConversationToUsers(sender, receiver, conversation.id);
    }
    return conversation;
}

export const addConversationToUsers = async (sender, receiver, conversationId) => {
    await User.updateMany({_id: {$in: [sender, receiver]}}, {$push: {conversations: conversationId}})
}

export const getUserConversations = async (id) => {
    const conversations = await User.findOne({_id: id})
        .populate(
            {
                path: "conversations",
                populate: {
                    path: "messages",
                    options: {  
                        sort: {
                            timestamp: -1
                        },
                        limit: 1
                    }
                }
            }
        )
        .populate(
            {
                path: "conversations",
                populate: {
                    path: "members",
                    select: "username image",
                    match: {
                        _id: {
                            $ne: id
                        }
                    }
                }
            }
        )
    return conversations;
}

export const getChatMessages = async (sender, receiver, page, items) => {
    const conversation = await Conversation
        .findOne({members: {$all: [sender, receiver]}})
        .populate({
            path: "messages",
            options: {
                skip: page * items,
                limit: items,
                sort: {timestamp: -1}
            }
        })
    return conversation;
}

export const sendMessageNotification = async (receiver, sender, message, type) => {
    const to = await findUserById(receiver);
    const from = await findUserById(sender);
    let expo = new Expo();
    let messages = [];
    messages.push({
        to: to.pushToken,
        sound: 'default',
        title: "New message",
        body: `${from.username}: ${type==="text"? message : "Voice message"}`,
    })
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
        try {
            await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
            console.error(error);
        }
    }
}