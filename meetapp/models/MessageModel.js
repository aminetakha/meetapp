class MessageModel{
	constructor(id, message, type, sender, duration, timestamp){
		this._id = id;
		this.message = message;
		this.type = type;
		this.sender = sender;
		this.duration = duration;
		this.timestamp = timestamp;
	}
}

export default MessageModel;