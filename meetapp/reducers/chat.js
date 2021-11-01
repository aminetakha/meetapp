const initialState = {
    scrollStatus: true
}

export default function(state=initialState, action){
    const {type, payload} = action;
    switch(type){
        case "SCROLL_STATUS":
            return {
                ...state,
                scrollStatus: payload
            }
        default:
            return state
    }
}