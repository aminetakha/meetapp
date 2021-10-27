import React, {useState} from "react";
import { View, TextInput, Pressable } from "react-native";
import {Ionicons} from "@expo/vector-icons";
import { Audio } from 'expo-av';
import * as FileSystem from "expo-file-system";

const MessageControls = ({textMessage, voiceMessage}) => {
	const [message, setMessage] = useState("");
	const [pressed, setPressed] = useState(false);
	const [recording, setRecording] = useState();
	
	const addTextMessage = () => {
		if(message.length === 0){
			return;
		}
		textMessage(message);
		setMessage("");
	}

	const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    const stopRecording = async () => {
        try {
			if(recording){
				setRecording(undefined);
				await recording.stopAndUnloadAsync();
				const uri = recording.getURI();
				const lastSlashIndex = uri.lastIndexOf("/");
				const filename = uri.slice(lastSlashIndex);
				const destination = await (FileSystem.documentDirectory + "Audio" + filename);
				await FileSystem.moveAsync({from: uri, to: destination})
				const duration = Math.floor(recording._finalDurationMillis / 1000);
				voiceMessage(destination, duration);
				await FileSystem.deleteAsync(uri, {idempotent: true})
			}
		} catch (error) {
			console.log("error", error)
		}
    }

	const onLongPress = async () => {
		setPressed(true);
		await startRecording();
	}

	const onPressOut = async () => {
		setPressed(false);
		await stopRecording();
	}

	return (
		<View style={{flexDirection: "row", alignItems: "center", height: 50}}>
			<View style={{flex: 1 }}>
				<TextInput placeholder="Say something..." style={{padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 4}} value={message} onChangeText={value => setMessage(value)} />
			</View>
			{!pressed && <View style={{ paddingHorizontal: 12 }}>
					<Ionicons name="send" size={28} onPress={addTextMessage} color='#457B9D' />
				</View>
			}
			<View>
                <Pressable pressRetentionOffset={{ bottom: 180, left: 180, right: 180, top: 180 }} delayLongPress={400} onLongPress={onLongPress} onPressOut={onPressOut}>
                    <Ionicons color={pressed? "crimson":'#457B9D'} name={pressed? "mic": "mic-outline"} size={pressed? 60 : 28} />
                </Pressable>
            </View>
		</View>
	)
}

export default MessageControls;