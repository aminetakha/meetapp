import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {Text, View, ActivityIndicator, Image, TouchableOpacity, FlatList, Dimensions, StyleSheet, Alert} from 'react-native';
import * as Notification from "expo-notifications";
import {useDispatch, useSelector} from "react-redux";
import { getSocket } from '../scoket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { addCurrentUser } from '../actions/auth';
import { API_URL } from '../config';

Notification.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const {width} = Dimensions.get("window")
const HomeScreen = (props) => {
    const [activeUsers, setActiveUsers] = useState([])
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const socket = getSocket()
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth)
    const filters = useSelector(state => state.filters)

    useEffect(() => {
        notificationListener.current = Notification.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        responseListener.current = Notification.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
    
        return () => {
            Notification.removeNotificationSubscription(notificationListener.current);
            Notification.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    useEffect(() => {
        if(isFocused){
            (async () => {
                const d = await AsyncStorage.getItem("user");
                console.log("ASYNC STORAGE", d)
                await getActiveUsers()
                setLoading(false)
            })()
        }
    }, [isFocused])

    const getActiveUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users?minAge=${filters.minAge}&maxAge=${filters.maxAge}&country=${filters.country}&gender=${filters.gender}&status=${filters.status}`)
            setActiveUsers(res.data.users)
        } catch (err) {
            setActiveUsers([])
            console.log("ERROR HOME SCREEN", err)
            Alert.alert("An error occured", "Please try again", [{text: "Ok", style: "default"}])
        }
    }

    const messageUser = (user) => {
        props.navigation.navigate("User Profile", {
            receiver: user
        })
    }

    const onRefresh = async () => {
        (async () => {
            setRefresh(true)
            await getActiveUsers()
            setRefresh(false)
        })()
    }

    const renderUser = ({item}) => {
        return (
            <TouchableOpacity onPress={() => messageUser(item)} style={styles.container}>
                <Image source={{uri: `${API_URL}/${item.image}`}} style={styles.image}  />
                <View style={styles.userInfo}>
                    <Text style={styles.info}>{item.username}, {item.country}</Text>
                    <Text style={styles.info}>{new Date().getFullYear() - new Date(item.birthdate).getFullYear()}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.root}>
            {loading? <ActivityIndicator size="large" color="crimson" /> : 
                activeUsers.length > 0 ? (
                    <FlatList 
                        data={activeUsers} 
                        keyExtractor={user => user._id} 
                        renderItem={renderUser}
                        numColumns={2}
                        refreshing={false}
                        onRefresh={onRefresh}
                    />
                ) : (
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>There are no active users</Text>
                    </View>
                )
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        paddingVertical: 15
    },
    container: {
        width: Math.floor(width / 2), 
        padding: 7
    },
    image: {
        width: "100%", 
        height: Math.floor(width / 2)
    },
    userInfo: {
        padding: 5, 
        borderRightWidth: 1, 
        borderLeftWidth: 1, 
        borderBottomWidth: 1, 
        borderColor: "#ccc"
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
    },
    info: {
        fontFamily: "OpenSans"
    }
})

export default HomeScreen