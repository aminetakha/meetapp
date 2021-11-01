import React, {useRef, useEffect} from "react";
import {View, Text, ScrollView, StyleSheet} from "react-native";
import { useSelector } from "react-redux";
import Message from "./Message";

const Chat = ({messages, fetchMoreMessages}) => {
    const scrollViewRef = useRef();
    const chat = useSelector(state => state.chat);
    
    const onScroll = e => {
        if(!e.nativeEvent.contentOffset.y){
            fetchMoreMessages();
        }
    }

    useEffect(() => {
        if(scrollViewRef.current){
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [])

    return messages.length === 0 ? (
        <View style={styles.textContainer}>
            <Text style={styles.text}>No conversation has started yet</Text>
            <Text style={styles.text}>Go ahead and break the silence</Text>
        </View>
    ): (
        <ScrollView 
            style={styles.scrollView}
            ref={scrollViewRef}
            onScroll={onScroll}
            scrollEnabled={chat.scrollStatus}
        >
            {messages.map((item, index) => (
                <Message key={index} id={item._id} message={item.message} timestamp={item.timestamp} type={item.type} duration={item.duration} sender={item.sender} />
            ))}
        </ScrollView>
    )  
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1
    },
    text: {
        color: "#ccc",
        textAlign: "center",
        fontSize: 18,
        fontFamily: "OpenSans",
    },
    textContainer: {
        marginTop: 30
    }
})

export default Chat;