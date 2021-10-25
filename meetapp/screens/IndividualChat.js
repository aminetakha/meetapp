import React, {useState, useEffect, useLayoutEffect}  from "react";
import {View, Text, ActivityIndicator, KeyboardAvoidingView, Platform, Alert} from "react-native";
import {useSelector, useDispatch} from "react-redux";
import * as FileSystem from "expo-file-system";
import Toast from 'react-native-root-toast';
import {AdMobRewarded, setTestDeviceIDAsync} from 'expo-ads-admob';
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useHeaderHeight } from '@react-navigation/elements';
import {API_URL} from "../config";
import Chat from "../components/Chat";
import MessageControls from "../components/MessageControls";
import MessageModel from "../models/MessageModel";
import { getSocket } from '../scoket';
import { reduceToken, resetToken } from '../actions/chat';

const IndividualChat = props => {
    const [receiver, setReceiver] = useState(props.route.params.receiver);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const auth = useSelector(state => state.auth);
    const [socket, setSocket] = useState(getSocket());
    const isFocused = useIsFocused();
    const headerHeight = useHeaderHeight();
    const dispatch = useDispatch();

    const getChatMessages = async () => {
        try {
            const res = await axios.get(`${API_URL}/chat/messages/${auth.id}/${receiver}?page=${page}&items=${itemsPerPage}`)
            res.data.conversations? setMessages(res.data.conversations.messages) : setMessages([])
            if(res.data.conversations){
                setMessages([...res.data.conversations.messages.reverse(), ...messages]);
                setPage(prev => prev + 1);
            }
            setLoading(false)
        } catch (err) {
            Alert.alert("An error occured", "Please try again", [{text: "Ok", style: "default"}])
            setMessage([])
            setLoading(false)
        }
    }

    /*const recordedUriToBase64 = async (uri) => {
        try {
            const data = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64})
            return data
        } catch (error) {
            console.log("ERROR IN GETTING THE RECORDED SOUND", error)
        }
    }*/

    const showRewardAd = async () => {
        try{
            await AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917');
            await AdMobRewarded.requestAdAsync();
            await AdMobRewarded.showAdAsync();
            await dispatch(resetToken(auth.id, 5));
            Toast.show('Five tokens added successfully', {
                duration: Toast.durations.LONG,
            });
        }catch(error){
            console.log("Error while showing the ad")
        }
    }

    const addAndSendMessage = async (type, message, duration) => {
        const lastSlashIndex = message.lastIndexOf("/");
        const filename = message.slice(lastSlashIndex + 1);
        if(auth.tokens > 0){
            let textVoiceMessage = {url: "", data: ""}
            if(type === "voice"){
                // const data = await recordedUriToBase64(message);
                textVoiceMessage.url = filename;
                // textVoiceMessage.data = data;
                await FileSystem.uploadAsync("http://192.168.1.12:5000/chat/upload-audio", message, {
                    fieldName: "audio",
                    httpMethod: "POST",
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    parameters: {
                        filename
                    }
                })
            }else{
                textVoiceMessage.data = message;
            }
            let messageModel = new MessageModel(Math.random(), filename, type, auth.id, duration, new Date());
            setMessages([...messages, messageModel]);
            socket.emit("message", {...messageModel, message: textVoiceMessage, receiver});
            dispatch(reduceToken())
        }else{
            Alert.alert(
                "No enough tokens", 
                "Choose a method below to gain tokens",
                [
                    {
                        text: "Watch ad",
                        onPress: showRewardAd
                    },
                    { 
                        text: "Buy Tokens", 
                        onPress: () => props.navigation.navigate("Checkout")
                    },
                    { 
                        text: "Cancel", 
                        type: "cancel"
                    }
                ]
            )
        }
    }

    const addTextMessage = (message) => {
        addAndSendMessage("text", message, null);
    }

    const addVoiceMessage = (message, duration) => {
        addAndSendMessage("voice", message, duration);
    }

    const onMessage = async (data) => {
        if(data.type === "text"){
            setMessages(prev => [...prev, {_id: Math.random(), sender: receiver, message: data.message, timestamp: data.timestamp, type: "text", duration: null}])
        }else if(data.type === "voice"){
            await onRecord(data)
        }
    }

    const onRecord = async data => {
        const uri = data.recordUri;
        console.log(uri)
        //await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "Audio/" + uri, data.message, { encoding: FileSystem.EncodingType.Base64 });
        setMessages(prev => [...prev, {_id: Math.random(), sender: receiver, message: uri, timestamp: data.timestamp, type: "voice", duration: data.duration}])
    }

    useLayoutEffect(() => {
        if(isFocused){
            props.navigation.setOptions({
                headerTitle: props.route.params.username,
                fontFamily: "OpenSans"
            })
        }
    }, [isFocused])

    useEffect(() => {
        if(isFocused){
            getChatMessages()
            socket.on("message", onMessage)
        }
        return () => {
            socket.off("message", onMessage)
        }
    }, [isFocused])

    useEffect(() => {
        const deviceId = async () => {
          await setTestDeviceIDAsync("EMULATOR")
        }
    }, [])

    useEffect(() => {
        FileSystem.getInfoAsync(FileSystem.documentDirectory + "Audio")
            .then(res => {
                if(!res.exists){
                    return FileSystem.makeDirectoryAsync(FileSystem.documentDirectory+"Audio")
                }
            })
            .then(res => console.log("CREATED"))
    }, [])

    return loading? <ActivityIndicator color="crimson" size="large" /> : (
        <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={headerHeight} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Chat messages={messages} fetchMoreMessages={getChatMessages} />
                </View>
                <View>
                    <MessageControls textMessage={addTextMessage} voiceMessage={addVoiceMessage} />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default IndividualChat;