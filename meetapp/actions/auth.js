import axios from "axios";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth"
import * as Notification from "expo-notifications"
import { androidClientId, API_URL, appId, iosClientId } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { getSocket } from '../scoket';

export const signInWithFacebook = () => async (dispatch) => {
    try {
        await Facebook.initializeAsync({
          appId
        });
        const {type, token} = await Facebook.logInWithReadPermissionsAsync({permissions: ['public_profile']});
        if (type === 'success') {
          let response = await axios.get(`https://graph.facebook.com/me?access_token=${token}`);
          const pushToken = await notificationPermission()
          // const data = await createUser(response.data.id, response.data.name, pushToken)
          // await AsyncStorage.setItem("auth_token", response.data.id)
          dispatch({type: "LOGIN_WITH_PROVIDER", payload: {providerId: response.data.id, username: response.data.name, pushToken}})
          return {
            type: "success",
          }
        }else{
          return "cancel"
        }
    } catch ({ message }) {
        return "error"
    }
}

export const signInWithGoogle = () => async dispatch => {
  try {
    const { type, user } = await Google.logInAsync({
      androidClientId,
      iosClientId,
      scope: ["profile"]
    });

    if(type === 'success') {
      const pushToken = await notificationPermission()
      // const data = await createUser(user.id, user.name, pushToken)
      // await AsyncStorage.setItem("auth_token", user.id)
      dispatch({type: "LOGIN_WITH_PROVIDER", payload: {providerId: user.id, username: user.name, pushToken}})
      return {
        type: "success",
      }
    }else{
      return {
        type: "cancel"
      }
    }
  } catch (err) {
    console.log("ERR", err)
    return {
      type: "error"
    }
  }
}

export const testSigning = () => async dispatch => {
  try {
    const pushToken = await notificationPermission()
    // const data = await createUser("123456789", "test account", pushToken)
    // await AsyncStorage.setItem("auth_token", "123456789")
    dispatch({type: "LOGIN_WITH_PROVIDER", payload: {providerId: "123456789", username: "test account", pushToken}})
    return {
      type: "success",
    }
  } catch (err) {
    console.log(err)
  }
}

export const createUser = user => async dispatch => {
  try {
    const response = await FileSystem.uploadAsync(`${API_URL}/auth`, user.image, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "photo",
        parameters: {
            data: JSON.stringify(user)
        }
    })

    const data = JSON.parse(response.body);
    dispatch({type: "CURRENT_USER", payload: {...data.user}})
    await AsyncStorage.setItem("user", JSON.stringify({
      _id: data.user._id,
      providerId: data.user.providerId,
      username: data.user.username,
      country: data.user.country,
      about: data.user.about,
      gender: data.user.gender,
      birthdate: data.user.birthdate,
      image: data.user.image,
      tokens: data.user.tokens,
      pushToken: data.user.pushToken
    }))
    const socket = getSocket();
    socket.emit('currentUser', data.user._id);
  } catch (err) {
    console.log(err)
  }
} 

export const addCurrentUser = (user) => dispatch => {
  dispatch({type: "CURRENT_USER", payload: user})
}

export const updateCurrentUserImage = (imageUri) => dispatch => {
  dispatch({type: "UPDATE_USER_IMAGE", payload: imageUri})
}

export const updateCurrentUserInfo = user => async dispatch => {
  try {
    const data = {
      user
    }
    const res = await axios.put(`${API_URL}/users/info`, data)
    dispatch({type: "UPDATE_USER_INFO", payload: res.data.user})
  } catch (err) {
    console.log(err)
  }
}

export const updateUsernameAndAbout = user => async dispatch => {
  try {
    const data = {
      user
    }
    const res = await axios.put(`${API_URL}/users/username-about`, data)
    dispatch({type: "UPDATE_USERNAME_ABOUT", payload: res.data.user})
    await AsyncStorage.setItem("user", JSON.stringify({
      _id: res.data.user._id,
      providerId: res.data.user.providerId,
      username: res.data.user.username,
      country: res.data.user.country,
      about: res.data.user.about,
      gender: res.data.user.gender,
      birthdate: res.data.user.birthdate,
      image: res.data.user.image,
      tokens: res.data.user.tokens,
      pushToken: res.data.user.pushToken
    }));
  } catch (err) {
    console.log(err)
  }
}

const notificationPermission = async () => {
  let result = await Notification.getPermissionsAsync()
  if(result.status !== "granted"){
    result = await Notification.requestPermissionsAsync()
    if(result.status !== "granted"){
      Alert.alert('Error', "Please allow permission")
      return null;
    }
  }else{
    try {
      const response = await Notification.getExpoPushTokenAsync();
      console.log("Token", response)
      return response.data
    } catch (err) {
      return ""
    }
  }
}