import { Alert } from "react-native";
import { API_URL } from "./config";

export async function fetchPublishableKey(){
    try {
        const response = await fetch(`${API_URL}/config`);
        const {publishableKey} = await response.json();
        console.log("fetchPublishableKey", publishableKey)
        return publishableKey;
    } catch (err) {
        console.log(err)
        console.log("Unable to fetch publishable key. Is your server running?")
        Alert.alert("Error", "Unable to fetch publishable key. Is your server running?")
    }
}