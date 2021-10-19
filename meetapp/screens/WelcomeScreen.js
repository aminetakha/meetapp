import React from 'react'
import {View, Text, Button} from 'react-native';
import Welcome from '../components/Welcome';

const DATA = [
    {id: 0, title: "Welcome to the app", color: "crimson"},
    {id: 1, title: "Meet and talk with new people", color: "aqua"},
    {id: 2, title: "Go ahead and complete your profile", color: "#ddd"}
]

const WelcomeScreen = (props) => {
    return (
        <Welcome data={DATA} navigateToSignIn={() => props.navigation.navigate("Upload")} />
    )
}

export default WelcomeScreen
