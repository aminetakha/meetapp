import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import IndividualChat from '../screens/IndividualChat';
import UserProfile from '../screens/UserProfile';
import CheckoutScreen from '../screens/CheckoutScreen';

const Stack = createStackNavigator();

const ChatNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerTitleStyle: {
                fontFamily: "OpenSans",
            }
        }}>
            <Stack.Screen name="List" component={HomeScreen} options={{headerTitle: "Online users"}} />
            <Stack.Screen name="User Profile" component={UserProfile} />
            <Stack.Screen name="Private" component={IndividualChat} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
        </Stack.Navigator>
    )
}

export default ChatNavigator
