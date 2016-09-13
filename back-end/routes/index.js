var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = "mongodb://localhost:27017/ecommerce";
var User = require('../models/users');
mongoose.connect(mongoUrl);

router.post('/register', function(req, res, next) {

	// if(req.body.password != req.body.password2){
	// 	res.json({
	// 		message: "passmatch"
	// 	})
	// }
  
	var newUser = new User({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	});

	newUser.save(function(error, user){
		console.log(error);
		console.log(user)
	});
	res.json({
		message: "added"
	});
});

module.exports = router;
