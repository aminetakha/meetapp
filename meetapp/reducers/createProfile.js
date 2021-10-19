const initialState = {
	username: "",
	birthdate: 0,
	country: "",
	gender: '',
	about: "",
	image: "",
	providerId: "",
	pushToken: "",
	tokens: 10
}

export default (state = initialState, action) => {
	switch(action.type){
		case "LOGIN_WITH_PROVIDER":
			return {
				...state,
				providerId: action.payload.providerId,
				username: action.payload.username,
				pushToken: action.payload.pushToken
			}
		case "CHANGE_IMAGE":
			return {
				...state,
				image: action.payload
			}
		case "PERSONAL_INFO":
			return {
				...state,
				username: payload.username,
	            gender: payload.gender,
	            date: payload.date,
	            country: payload.country,
	            about: payload.about,
			}
		default:
			return state
	}
}