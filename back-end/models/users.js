var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	token: {type: String},
	tokenExpDate: Date,
	name: String,
	address: String,
	address2: String,
	city: String,
	state: String, 
	zipCode: String,
	phone: String,
	order: String
});

module.exports = mongoose.model('User', userSchema);