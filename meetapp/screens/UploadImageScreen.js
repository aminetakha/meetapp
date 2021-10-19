import React, {useState} from 'react'
import { View, Alert, TouchableOpacity, Text, Image } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Cam from '../components/Camera';
import {useSelector, useDispatch} from 'react-redux'
import * as FileSystem from 'expo-file-system';
import { API_URL } from '../config';
import axios from "axios";
import {COLORS} from "../colors"

const UploadImageScreen = (props) => {
    const [image, setImage] = useState(null);
    const [openCamera, setOpenCamera] = useState(false)
    const [loading, setLoading] = useState(false)

    const { showActionSheetWithOptions } = useActionSheet();
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch();

    const uploadFromGallery = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status === 'granted') {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                });
                if (!result.cancelled) {
                    setImage(result.uri);
                    dispatch({type: "CHANGE_IMAGE", payload: result.uri});
                }
            }
        } catch (err) {
            setImage(null)
            Alert.alert("An error occured", "Please try again", [{text: "Ok", style: "default"}])
        }
    }

    const takePictureHandler = async () => {
        setOpenCamera(true)
    }
    const uploadHandler = () => {
        props.navigation.navigate("PersonalInfo")
    }

    onOpenActionSheet = () => {
        const options = ['Take it now', 'Choose from gallery', 'Cancel'];
        const cancelButtonIndex = 2;
      
        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
            userInterfaceStyle: "dark",
            textStyle: {color: "black"},
            title: "Choose your best photo",
            icons: [
                <Ionicons name="camera-reverse-outline" size={25} />,
                <Ionicons name="image-outline" size={25} />,
                <Ionicons name="close-outline" size={25} />
            ]
          },
          buttonIndex => {
            setTimeout(async () => {
                if(buttonIndex === 0){
                    await takePictureHandler();
                }else if(buttonIndex === 1){
                    await uploadFromGallery()
                }
            }, 250)
          },
        );
    };

    const takeImageFromCamera = value => {
        setImage(value);
        dispatch({type: "CHANGE_IMAGE", payload: value});
    }

    if(openCamera){
        return <Cam close={() => setOpenCamera(false)} image={value => takeImageFromCamera(value)}  />
    }

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <View style={{alignItems: "center", marginVertical: 20}}>
                {image && <Image source={{uri: image}} style={{ width: 150, height: 150, borderRadius: 75 }} />}
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={onOpenActionSheet} style={{ marginVertical: 20, backgroundColor: COLORS.primary, padding: 16, borderRadius: 7 }}>
                <Text style={{ fontFamily: "OpenSans", color: "white", fontSize: 16 }}>Choose A Profile Image</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={image === null || loading} onPress={uploadHandler} activeOpacity={0.8} style={{ backgroundColor: image === null || loading? COLORS.lightPrimary : COLORS.primary, padding: 10, borderRadius: 5 }}>
                <Text style={{ fontFamily: "OpenSans", color: "white", fontSize: 15 }}>Upload Now</Text>
            </TouchableOpacity>
        </View>
    )
}

export default UploadImageScreen
