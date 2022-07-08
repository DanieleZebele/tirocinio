const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/dabatase")
const userSchema = new mongoose.Schema({
	counter:{
		type: Number,
		required: true
	},
	scanner:{
		type: String,
		required: true
	},
	command:{
		type: String,
		required: true
	},
	outputFile:{
		type: String,
		required: true
	},
    status:{
		type: String,
		required: true
    },
    totalHosts:{
		type: Number,
    },
    createdAt:{
		type: Date,
        required: true
	},
	finishedAt:{
		type: Date,
	},
})

module.exports = mongoose.models.Scan || mongoose.model("Scan",userSchema)