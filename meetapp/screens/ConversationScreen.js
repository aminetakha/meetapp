import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, ActivityIndicator, Image, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {useSelector} from "react-redux"
import axios from "axios"
import { useIsFocused } from "@react-navigation/native";
import { API_URL } from '../config';
import {date} from "../config/date"

const ConversationScreen = (props) => {
    const auth = useSelector(state => state.auth)
    const [loading, setLoading] = useState(false)
    const [conversations, setConversations] = useState([])
    const isFocused = useIsFocused();

    useLayoutEffect(() => {
        if(isFocused){
            props.navigation.setOptions({
                headerTitle: "Conversations",
                headerTitleStyle: {
                    fontFamily: "OpenSans"
                }
            })
        }
    }, [isFocused])

    useEffect(() => {
        if(isFocused){
            getConversations()
        }
    }, [isFocused])

    const getConversations = async () => {
        try{
            setLoading(true)
            const res = await axios.get(`${API_URL}/chat/${auth.id}`);
            setConversations(res.data.conversations.conversations)
            setLoading(false)
        }catch(error){
            setConversations([])
            setLoading(false)
            console.log(error)
            Alert.alert("An error occured", "Please try again", [{text: "Ok", style: "default"}])
        }
    }

    return (
        <ScrollView style={styles.scrollView}>
            {loading? <ActivityIndicator color='crimson' size="large" />: 
                conversations.length > 0 ? conversations.map((conversation) => (
                    <TouchableOpacity key={conversation._id} style={styles.conversationContainer} 
                        onPress={() => props.navigation.navigate("Private", {
                                receiver: conversation.members[0]._id,
                                username: conversation.members[0].username
                            })
                        }
                    >
                        <View>
                            <Image source={{uri:`${API_URL}/${conversation.members[0].image}`}} style={styles.image}/>
                        </View>
                        <View style={styles.conversation}>
                            <Text style={styles.username}>{conversation.members[0].username}</Text>
                            <Text style={{fontFamily: "OpenSans"}}>{conversation.messages[0].type === "voice"? "Voice message": conversation.messages[0].message}</Text>
                            <Text style={styles.date}>{date(conversation.messages[0].timestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                )) : (
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>There are no conversations</Text>
                    </View>
                )
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 10
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 50
    },
    conversationContainer: {
        flexDirection: 'row',
        alignItems: "center",
        paddingVertical:14,
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },
    username: {
        fontSize: 16,
        fontFamily: "OpenSans-Bold",
    },
    date: {
        textAlign: "right"
    },
    conversation: {
        flex: 1,
        paddingLeft: 15
    },
    text: {
        color: "#ccc",
        textAlign: "center",
        fontSize: 18,
        fontFamily: "OpenSans",
    },
    textContainer: {
        height: 300,
        justifyContent: "flex-end"
    }
})

export default ConversationScreen
