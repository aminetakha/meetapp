import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/SettingsScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatNavigator from './ChatNavigator';

const Tab = createBottomTabNavigator();


const MainNavigator = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarLabelStyle: {
                fontFamily: "OpenSans"
            },
            tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
                iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Chat') {
                iconName = focused ? 'chatbox' : 'chatbox-outline';
            }
            else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
            }
            else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#E63946',
            tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={ChatNavigator} options={{headerShown: false}} />
            <Tab.Screen name="Chat" component={ConversationScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    )
}

export default MainNavigator
