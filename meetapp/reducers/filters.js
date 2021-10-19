const initialState = {
    gender: "",
    minAge: 18,
    maxAge: 60,
    status: "online",
    country: ""
}

export default (state = initialState, actions) => {
    switch(actions.type){
        case "UPDATE_FILTERS":
            return {
                ...state,
                gender: actions.payload.gender,
                minAge: actions.payload.minAge,
                maxAge: actions.payload.maxAge,
                country: actions.payload.country
            }
        default:
            return state;
    }
}