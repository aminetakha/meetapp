import React, {useRef} from "react";
import {View, Text, ScrollView, StyleSheet} from "react-native";
import Message from "./Message";

const Chat = ({messages}) => {
    const scrollViewRef = useRef();
    
    return messages.length === 0 ? (
        <View>
            <Text>No conversation has started yet</Text>
            <Text>Go ahead and break the silence</Text>
        </View>
    ): (
        <ScrollView 
            style={styles.scrollView}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
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
    }
})

export default Chat;