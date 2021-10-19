import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";

export default function Cam(props) {
	const [hasPermission, setHasPermission] = useState(false)
	const [flash, setFlash] = useState("off")
	const [type, setType] = useState(Camera.Constants.Type.back);
	const camera = useRef()

	useEffect(() => {
		requestTakePicHandler();
		return () => camera.current = null;
	}, [])
	
	const requestTakePicHandler = async () => {
		const {status} = await Camera.requestPermissionsAsync()
		setHasPermission(status === "granted")
	}

	const takePicHandler = async () => {
		let photo = await camera.current.takePictureAsync();
        props.image(photo.uri)
        props.close()
	}

	const changeFlash = () => {
		if(flash === "off"){
			setFlash('on')
		}else if(flash === "on"){
			setFlash("off")
		}
	}

	if(hasPermission){
		return <View style={styles.cameraContainer}>
			<Camera 
				style={styles.camera} 
				type={type} 
				zoom={0} 
				ratio="16:9" 
				ref={camera} 
				flashMode={flash}
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => {
						setType(
							type === Camera.Constants.Type.back
							? Camera.Constants.Type.front
							: Camera.Constants.Type.back
						);
						}}>
						<Ionicons name="camera-reverse-outline" size={30} color="white" />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.takePicButton}
						onPress={takePicHandler}>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}
						onPress={changeFlash}
					>
						<Ionicons name="flash-outline" size={30} color={flash === "off"? "white": "yellow"} />
					</TouchableOpacity>
				</View>
			</Camera>
			<StatusBar hidden={true}  />
		</View>
	}

	return (
		<View style={styles.container}>
			<StatusBar hidden={true}  />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex:1, 
		justifyContent: "center"
	},
	cameraContainer: {
	  flex: 1,
	},
	camera: {
	  flex: 1,
	  position: "relative"
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		margin: 20,
		justifyContent: "space-around",
		zIndex: 10
	},
	button: {
	  alignSelf: 'flex-end',
	  alignItems: 'center',
	},
	takePicButton: {
		width: 70,
		height: 70,
		borderRadius: 70,
		backgroundColor: "aqua",
		borderWidth: 4,
		borderColor: "white",
		alignSelf: 'flex-end',
	},
	text: {
	  fontSize: 18,
	  color: 'white',
	},
	faceContainer: {
		position: "absolute", 
		top: 0, 
		bottom: 0, 
		right: 0, 
		left: 0, 
		zIndex: 50, 
		backgroundColor: "transparent"
	}
  });
