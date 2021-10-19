import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import { StatusBar } from 'react-native';
import UploadImageScreen from '../screens/UploadImageScreen';
import PersonalInfo from '../screens/PersonalInfo';
import MainNavigator from './MainNavigator';

const Tab = createBottomTabNavigator();


const DatingAppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown: false}} tabBar={() => null}>
                <Tab.Screen name="SignIn" component={SignInScreen} />
                <Tab.Screen name="Welcome" component={WelcomeScreen} />
                <Tab.Screen name="Upload" component={UploadImageScreen} />
                <Tab.Screen name="PersonalInfo" component={PersonalInfo} />
                <Tab.Screen name="Main" component={MainNavigator} />
            </Tab.Navigator>
            <StatusBar hidden={true} />
        </NavigationContainer>
    )
}

export default DatingAppNavigator
