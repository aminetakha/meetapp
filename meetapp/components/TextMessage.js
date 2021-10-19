import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import {date} from "../config/date";

const TextMessage = ({message}) => {
	const auth = useSelector(state => state.auth);

	return (
		<View 
			style={[
		        styles.message, 
		        {backgroundColor: message.sender === auth.id? "#F1FAEE": "#457B9D"},
		        {alignSelf: message.sender === auth.id? "flex-end" : "flex-start"}
		    ]}
		>
			<Text style={{color: message.sender === auth.id? "black" : "white", fontFamily: "OpenSans"}}>{message.message}</Text>
			<Text style={[styles.timestamp, {color: message.sender === auth.id? "black" : "white"}]}>{date(message.timestamp)}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	message: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 7,
        marginVertical: 5
    },
    timestamp: {
        fontSize: 11,
        marginTop: 4,
        textAlign: "right",
        fontFamily: "OpenSans",
        paddingLeft: 23
    },
})

export default TextMessage;