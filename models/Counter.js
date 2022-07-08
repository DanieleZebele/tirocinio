const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/dabatase")
const userSchema = new mongoose.Schema({
	num:{
		type: Number,
	}
})

module.exports = mongoose.models.Counter || mongoose.model("Counter",userSchema) 