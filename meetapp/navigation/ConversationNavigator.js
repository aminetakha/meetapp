import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ConversationScreen from '../screens/ConversationScreen';
import IndividualChat from '../screens/IndividualChat';

const Stack = createStackNavigator();

const ChatNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Conversation" component={ConversationScreen} />
            <Stack.Screen name="Private" component={IndividualChat} />
        </Stack.Navigator>
    )
}

export default ChatNavigator
