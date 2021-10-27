import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {Text, View, ActivityIndicator, Image, TouchableOpacity, FlatList, Dimensions, StyleSheet, Alert} from 'react-native';
import * as Notification from "expo-notifications";
import {useSelector} from "react-redux";
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
    const filters = useSelector(state => state.filters)
    const [page, setPage] = useState(0);
    const [itemsPerPage] = useState(8);

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
        getActiveUsers(0, false);
    }, [])

    const getActiveUsers = async (page, isRefreshing) => {
        try {
            const res = await axios.get(`${API_URL}/users?minAge=${filters.minAge}&maxAge=${filters.maxAge}&country=${filters.country}&gender=${filters.gender}&status=${filters.status}&page=${page}&items=${itemsPerPage}`)
            if(isRefreshing){
                setActiveUsers(res.data.users);
                setPage(0);
            }else{
                setActiveUsers([...activeUsers, ...res.data.users]);
                setPage(prev => prev + 1);
            }
            setLoading(false)
        } catch (err) {
            setActiveUsers([])
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
            await getActiveUsers(0, true)
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
                        refreshing={refresh}
                        onRefresh={onRefresh}
                        onEndReachedThreshold={0.3}
                        onEndReached={() => getActiveUsers(page, false)}
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
        paddingTop: 15
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
        borderColor: "#ccc",
        height: 80
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