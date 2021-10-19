import { io } from "socket.io-client";
import { API_URL } from "./config";

let socketInstance = null;

export const getSocket = () => {
    if(!socketInstance){
        socketInstance = io(API_URL)
    }
    return socketInstance;
}