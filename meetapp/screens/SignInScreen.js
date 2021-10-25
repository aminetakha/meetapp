import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, Alert, ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import { useDispatch } from 'react-redux';
import { signInWithFacebook, signInWithGoogle, testSigning } from '../actions/auth';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from "../colors";
import { getSocket } from '../scoket';

const SignInScreen = (props) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const socket = getSocket();

    const signInWithProvider = async provider => {
        let data;
        setLoading(true)
        if(provider === "google"){
            data = await dispatch(signInWithGoogle())
        }else if(provider === "facebook"){
            data = await dispatch(signInWithFacebook())
        }else if(provider === "test"){
            data = await dispatch(testSigning())
        }
        navigate(data)
    }

    const navigate = data => {
        if(data.type === "success"){
            props.navigation.navigate("Welcome")
        }else if(data.type === "cancel"){
            setLoading(false)
            Alert.alert("Sign in has been canceled", "Please try again", [{ text: "OK" }])
        }else if(data.type === "error"){
            setLoading(false)
            Alert.alert("An error occured", "Please try again", [{ text: "OK" }])
        }
    }

    useEffect(() => {
        setLoading(true)
        if(isFocused){
            navigateToMain()
        }
    }, [isFocused])

    const chechAuth = async () => {
        const user = JSON.parse(await AsyncStorage.getItem("user"));
        return user !== null ? user : null;
    }

    const navigateToMain = async () => {
        const user = await chechAuth();
        if(user){
            dispatch({type: "CURRENT_USER", payload: user})
            socket.emit('currentUser', user._id);
            props.navigation.navigate("Main")
        }
        setLoading(false);
        // await AsyncStorage.removeItem("user")
    }

    return (
        <View style={styles.container}>
            {loading? 
                <View style={styles.loading}><ActivityIndicator size="large" color="#0000ff" /></View>: 
                <ImageBackground source={require("../assets/datingapp1.jpg")} style={styles.image}>
                    <View style={{ paddingVertical: 25, paddingHorizontal: 30 }}>
                        <View>
                            <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.secondary}]} onPress={() => signInWithProvider("facebook")}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Ionicons name="logo-facebook" size={23} color='white' />
                                    <Text style={styles.text}>Sign in with facebook</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.primary}]} onPress={() => signInWithProvider("google")}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Ionicons name="logo-google" size={23} color="white" />
                                    <Text style={styles.text}>Sign in with google</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.tertiary}]} onPress={() => signInWithProvider("test")}>
                                <Text style={styles.text}>Test Sign</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    loading: {
        flex: 1,
        justifyContent: "center" 
    },
    image: {
        flex: 1, 
        resizeMode: 'cover', 
        justifyContent: "flex-end"
    },
    facebook: {
        backgroundColor: "#3748F7"
    },
    google: {
        backgroundColor: "#E63946"
    },
    text: {
        fontFamily: "OpenSans",
        color: "white",
        fontSize: 16,
        marginLeft: 12
    },
    button: {
        alignItems: "center",
        paddingVertical: 16,
        marginVertical: 5,
        borderRadius: 7
    }
})

export default SignInScreen;