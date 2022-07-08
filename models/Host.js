const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
mongoose.connect("mongodb://localhost/dabatase")
const userSchema = new mongoose.Schema({
	macAddress:{
		type: String,
		required: true
	},
	address:{
		type: String,
		required: true
	},
    hostname:{
		type: String,
		required: true
	},
	status:{
		type: String,
		required: true
	},
	os:{
		type: String,
		required: true
	},
	scanId:{
		type: ObjectId,
		required: true
	},
	ports:{
		type: Mixed,
		required: true		
	}
})

module.exports = mongoose.models.Host || mongoose.model("Host",userSchema) 