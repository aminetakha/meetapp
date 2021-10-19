import axios from "axios"
import { API_URL } from "../config"

export const reduceToken = () => (dispatch) => {
    dispatch({type: "REDUCE_TOKEN"})
}

export const resetToken = (userId, tokens) => async dispatch => {
    try {
        await axios.patch(`${API_URL}/users/tokens`, {
            id: userId,
            tokens
        })
        dispatch({type: "RESET_TOKEN", payload: tokens})
    } catch (error) {
        console.log("ERROR RESETING TOKEN FROM AD")
    }
}