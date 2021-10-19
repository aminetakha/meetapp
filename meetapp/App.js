import React, {useState, useEffect} from 'react';
import { Provider } from 'react-redux';
import DatingAppNavigator from './navigation/DatingAppNavigator';
import { RootSiblingParent } from 'react-native-root-siblings';
import AppLoading from 'expo-app-loading';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import { store } from './store';
import { fetchPublishableKey } from './helpers';

export default function App() {
  const [publishableKey, setPublishableKey] = useState("")
  const [loading, setLoading] = useState(false)

  const loadFont = async () => {
    await Font.loadAsync({
      "OpenSans": require('./assets/font/OpenSans-Regular.ttf'),
      'OpenSans-Bold': require("./assets/font/OpenSans-Bold.ttf")
    });
  }

  const init = async () => {
    await loadFont();
  }

  if(!loading){
    return <AppLoading startAsync={init} onFinish={() => setLoading(true)} onError={() => console.log("ERROR APP LOADING")} />
  }

  return (
      <Provider store={store}>
        <RootSiblingParent>
          <ActionSheetProvider>
            <DatingAppNavigator />
          </ActionSheetProvider>
        </RootSiblingParent>
      </Provider>
  );
}