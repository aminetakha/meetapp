import React, {useState, useLayoutEffect} from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import {Ionicons} from "@expo/vector-icons";
import {useSelector} from "react-redux"
import { useIsFocused } from "@react-navigation/native";
import { API_URL } from '../config';
import {COLORS} from "../colors";

const {width} = Dimensions.get("window");
const UserProfile = (props) => {
    const [receiver] = useState(props.route.params.receiver);
    const isFocused = useIsFocused();
    const auth = useSelector(state => state.auth)

    const sendMessage = () => {
        props.navigation.navigate("Private", {
            receiver: receiver._id,
            username: receiver.username
        })
    }

    useLayoutEffect(() => {
        if(isFocused){
            props.navigation.setOptions({
                headerTitle: "Back",
                fontFamily: "OpenSans"
            })
        }
    }, [isFocused])

    const User = () => {
        return (
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View>
                    <View style={styles.imageContainer}>
                        <Image source={{uri: `${API_URL}/${receiver.image}`}} style={styles.image} />
                    </View>
                   
                    {receiver._id !== auth.id && 
                        <View style={styles.messageBtn}>
                            <TouchableOpacity onPress={sendMessage} activeOpacity={0.7}>
                                <Ionicons name="chatbox-ellipses" size={35} color={COLORS.secondary} />
                            </TouchableOpacity>
                        </View>
                    }
                    
                    <View style={styles.wrapper}>
                        <View style={styles.info}>
                            <Ionicons name="person" size={35} color={COLORS.secondary} />
                            <Text style={styles.text}>{receiver.username}</Text>
                        </View>
                    </View>
                    <View style={styles.wrapper}>
                        <View style={styles.info}>
                            <Ionicons name="hourglass" size={35} color={COLORS.secondary} />
                            <Text style={styles.text}>{new Date().getFullYear() - new Date(receiver.birthdate).getFullYear()} years old</Text>
                        </View>
                    </View>
                    <View style={styles.wrapper}>
                        <View style={styles.info}>
                            <Ionicons name="male-female" size={35} color={COLORS.secondary} />
                            <Text style={styles.text}>{receiver.gender}</Text>
                        </View>
                    </View>
                    <View style={styles.wrapper}>
                        <View style={styles.info}>
                            <Ionicons name="earth" size={35} color={COLORS.secondary} />
                            <Text style={styles.text}>{receiver.country}</Text>
                        </View>
                    </View>
                    <View style={styles.wrapper}>
                        <View style={styles.info}>
                            <Ionicons name="albums" size={35} color={COLORS.secondary} />
                            <Text style={[{flexShrink: 1, ...styles.text}]}>{receiver.about}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <User />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white"
    },
    wrapper: {
        paddingLeft: 27,
        width
    },  
    imageContainer: {
        width
    },
    image: {
        width: "100%", 
        height: width - 30
    },
    message: {
        alignItems: "flex-end",
    },
    scrollView: {
        backgroundColor: "white",
        paddingBottom: 20
    },
    text: {
        fontSize: 16,
        fontFamily: "OpenSans",
        marginLeft: 15
    },
    info: { 
        flexDirection: "row", 
        alignItems: "center",
        marginTop: 20 
    },
    messageBtn: { 
        alignItems: "flex-end", 
        paddingHorizontal: 27, 
        marginTop: 20 
    }
})

export default UserProfile