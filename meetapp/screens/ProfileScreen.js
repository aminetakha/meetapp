import React, {useState, useLayoutEffect} from 'react';
import { ScrollView, StyleSheet, Alert, Text, TextInput, Image, View, TouchableOpacity} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import {useSelector, useDispatch} from 'react-redux'
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { updateCurrentUserImage, updateUsernameAndAbout } from '../actions/auth';
import { API_URL } from '../config';
import { useIsFocused } from "@react-navigation/native";
import { COLORS } from "../colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

const YEAR = new Date().getFullYear();

const ProfileScreen = (props) => {
    const auth = useSelector(state => state.auth);
    const [username, setUsername] = useState(auth.username);
    const [about, setAbout] = useState(auth.about);
    const [country, setCountry] = useState(auth.country);
    const [image, setImage] = useState(auth.image || null);
    const [loading, setLoading] = useState(false)
    const USER_BIRTH_YEAR = new Date(auth.birthdate).getFullYear();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    useLayoutEffect(() => {
        if(isFocused){
            props.navigation.setOptions({
                headerTitleStyle: {
                    fontFamily: "OpenSans"
                }
            })
        }
    }, [isFocused])

    const updateProfileHandler = async () => {
        try {
            const user = {
                username,
                about,
                providerId: auth.providerId
            };
            setLoading(true)
            await dispatch(updateUsernameAndAbout(user));
            setLoading(false)
            Alert.alert("Success", "Profile has been updated successfully", null, [{text: "Ok", style: "default"}]);
        } catch (err) {
           console.log("Error - UpdateProfileHandler", err) 
        }  
    }

    const updateProfilePicture = async (selectedImage) => {
        try {
            const res = await FileSystem.uploadAsync(`${API_URL}/users`, selectedImage, {
                httpMethod: 'PUT',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: "photo",
                parameters: {
                    providerId: auth.providerId
                }
            })
            const data = JSON.parse(res.body);
            Alert.alert("Updated Successfully", null, [{text: "Ok", style: "default"}]);
            setImage(data.user.image);
            dispatch(updateCurrentUserImage(data.user.image));
            await AsyncStorage.setItem("user", JSON.stringify({
                _id: auth._id,
                providerId: auth.providerId,
                username: auth.username,
                country: auth.country,
                about: auth.about,
                gender: auth.gender,
                birthdate: auth.birthdate,
                image: data.user.image,
                tokens: auth.tokens,
                pushToken: auth.pushToken
            }))
        } catch (error) {
            Alert.alert("An error occured", "Please try again", [{text: "Ok", style: "default"}])
        }
    }

    const choosePic = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                updateProfilePicture(result.uri);
            }
        }
    }

    return (
        <ScrollView style={styles.scrollView} keyboardDismissMode='on-drag' keyboardShouldPersistTaps="always" >
            <View style={{ alignItems: "center", paddingHorizontal: 23, paddingVertical: 35 }}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: `${API_URL}/${image}`}} style={{ width: 150, height: 150, borderRadius: 75 }} />
                    <View style={styles.iconContainer}>
                        <Ionicons onPress={choosePic} name='image-outline' size={28} color="white" />
                    </View>
                </View>
                <View style={{ width: "100%", marginBottom: 25 }}>
                    <Text style={styles.text}>Username :</Text>
                    <TextInput value={username} onChangeText={v => setUsername(v)} placeholder='Updated your name' style={styles.input} />
                </View>
                <View style={{ width: "100%", marginBottom: 25 }}>
                    <Text style={styles.text}>About :</Text>
                    <TextInput multiline value={about} onChangeText={v => setAbout(v)} placeholder='Tell us about yourself' style={[styles.input, {height: 100}]} />
                </View>
                <View style={{ width: "100%", marginBottom: 25 }}> 
                    <Text style={styles.text}>Age :</Text>
                    <TextInput
                        style={styles.input}
                        value={`${YEAR - USER_BIRTH_YEAR}`}
                        disabled
                        editable={false}
                    />
                </View>
                <View style={{ width: "100%", marginBottom: 25 }}>
                    <Text style={styles.text}>Country :</Text>
                    <TextInput
                        style={styles.input}
                        width="100%"
                        value={country}
                        disabled
                        editable={false}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={updateProfileHandler} disabled={loading}>
                    <Text style={{fontFamily: "OpenSans", color: "white", fontSize: 16}}>Update profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "white",
    },
    button: {
        width: "100%",
        backgroundColor: COLORS.secondary,
        alignItems: "center",
        paddingVertical: 13,
        borderRadius: 6
    },
    imageContainer: {
        borderRadius: 100, 
        overflow: "hidden",
        marginBottom: 25
    },
    iconContainer: {
        backgroundColor: "black", 
        opacity: 0.7,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center"
    },
    text: { 
        fontSize: 16, 
        marginBottom: 7,
        fontFamily: "OpenSans"
    },
    input: {
        width: "100%", 
        paddingHorizontal: 15, 
        paddingVertical: 10, 
        borderWidth: 1, 
        borderColor: "#ccc", 
        borderRadius: 6
    }
})

export default ProfileScreen
