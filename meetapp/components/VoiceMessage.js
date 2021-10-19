import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Progress from "./Progress";
import { Audio } from 'expo-av';
import { useSelector } from "react-redux";
import {date, formatSeconds} from "../config/date";
import {COLORS} from "../colors";

const VoiceMessage = ({message}) => {
	const [sound, setSound] = useState();
	const [play, setPlay] = useState(false);
	const [seek, setSeek] = useState(0);
	const auth = useSelector(state => state.auth);

	const playOrPause = async (uri) => {
		if(!play){
			await playSound(uri);
		}else{
			await stopSound();
		}
	}

	const playSound = async uri => {
		const { sound } = await Audio.Sound.createAsync({uri: `http://192.168.1.12:5000/${uri}`});
        setSound(sound);
        setPlay(prev => !prev);
        await sound.playFromPositionAsync(seek);
	}

	const stopSound = async () => {
		setPlay(false)
		await sound.pauseAsync();
	}

	const onProgress = value => {
		setSeek(value);
	}

	return (
		<View 
			style={[
		        styles.message, 
		        {backgroundColor: message.sender === auth.id? "#F1FAEE": "#457B9D"},
		        {alignSelf: message.sender === auth.id? "flex-end" : "flex-start"}
		    ]}
		>
			<View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Progress textColor={message.sender === auth.id? "black" : "white"} onProgress={onProgress} start={play} finish={() => setPlay(false)} value={0} width={150} height={5} primary={COLORS.primary} secondary={COLORS.lightPrimary} max={message.duration} borderRadius={10} />
                    <Ionicons name={play ? "pause" : "play" } size={35} color={message.sender === auth.id? "#457B9D": "#A5F3FC"} onPress={() => playOrPause(message.message)} />
                </View>
            </View>
			<Text style={[styles.timestamp, {color: message.sender === auth.id? "black" : "white"}]}>{date(message.timestamp)}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	message: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 7,
        marginVertical: 5
    },
    timestamp: {
        fontSize: 11,
        marginTop: 4,
        textAlign: "right",
        fontFamily: "OpenSans",
        paddingLeft: 23
    },
})

export default VoiceMessage;