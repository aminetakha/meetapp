import React from "react";
import { Text, View } from "react-native";
import TextMessage from './TextMessage';
import VoiceMessage from "./VoiceMessage";
import MessageModel from "../models/MessageModel";

const Message = ({id, message, timestamp, type, sender, duration}) => {
	let item = new MessageModel(id, message, type, sender, duration, timestamp);
	return <View>
            {item.type === "text" ? <TextMessage message={item} /> : <VoiceMessage message={item} />}
     	</View>
}

export default React.memo(Message);