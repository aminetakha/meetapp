const initialState = {
    id: "",
    providerId: "",
    username: "",
    image: "",
    birthdate: "",
    gender: "",
    country: "",
    about: "",
    tokens: 0,
    pushToken: ""
}

export default (state=initialState, action) => {
    switch(action.type){
        case "CURRENT_USER":
            return {
                ...state,
                id: action.payload._id,
                providerId: action.payload.providerId,
                username: action.payload.username,
                image: action.payload.image,
                birthdate: action.payload.birthdate,
                gender: action.payload.gender,
                country: action.payload.country,
                about: action.payload.about,
                tokens: action.payload.tokens,
                pushToken: action.payload.pushToken,
            }
        case "UPDATE_USER_INFO":
            return {
                ...state,
                id: action.payload._id,
                providerId: action.payload.providerId,
                username: action.payload.username,
                image: action.payload.image,
                birthdate: action.payload.birthdate,
                gender: action.payload.gender,
                country: action.payload.country,
                about: action.payload.about,
                pushToken: action.payload.pushToken,
            }
        case "UPDATE_USERNAME_ABOUT":
            return {
                ...state,
                username: action.payload.username,
                about: action.payload.about
            }
        case "UPDATE_USER_IMAGE":
            return {
                ...state,
                image: action.payload
            }
        case "REDUCE_TOKEN":
            return {
                ...state,
                tokens: state.tokens - 1
            }
        case "RESET_TOKEN":
            return {
                ...state,
                tokens: action.payload
            }
        default:
            return state
    }
}