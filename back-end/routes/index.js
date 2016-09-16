var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoUrl = "mongodb://localhost:27017/ecommerce";
var User = require('../models/users');
mongoose.connect(mongoUrl);
//include bcrypt to store hashed pass
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token').uid;
var config = require('../config/config'); //this is our config module.
//we have access to config.secretTestKey
var stripe = require("stripe")(config.secretTestKey);

router.post('/register', function(req, res, next) {

	// User.findOne(
	// 	{username: req.body.username},
	// 	function(error, document))

	// if(req.body.password != req.body.password2){
	// 	res.json({
	// 		message: "passmatch"
	// 	})
	// }
  	var token = randToken(32);
	var newUser = new User({
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password),
		email: req.body.email,
		token: token
	});

	newUser.save(function(error, user, documentAdded){
		console.log(error);
		console.log(user)
	});
	res.json({
		message: "added",
		token: token
	});
});

router.post('/login', function(req, res, next){
	User.findOne(
		{username: req.body.username}, //this is the droid we're looking for
		function(error, document){
			//document is the deocument returned from our mongo query
			//the document will have a property of each filed. we need to check the password field
			//in the db agains the hashed bcrypt version
			if(document == null){
				// no match
				res.json({failure: "noUser"});
			}else{
				//run comparsync. First param is the english password, second param is the hash
				//it will return true if they are equal and false if they are not
				var loginResult = bcrypt.compareSync(req.body.password, document.password);
				
				if(loginResult){
					var token = randToken(32);
					// User.update(
					// 	{username: req.body.username},
					// 	{
					// 		token: document.token
					// 	}
					// 	)
					res.json({
						success: "userfound",
						username: req.body.username,
						token: document.token
					});
				}else{
					//hashes did not match or the doc wasnt found. goodbye.
					res.json({
						failure: "badPass"
					});
				}
			}
		}
	)
});

router.get('/getUserData', function(req, res, next){
	var userToken = req.query.token; // the XXX in ?token=[XXXXX]
	if(userToken == undefined){
		//No token was supplied
		res.json({failure: "noToken"});
	}else{
		User.findOne(
			{token: userToken}, //THis is the droid we're looking for
			function(error, document){
				if(document == null){
					//this token is not in the system
					res.json({failure: 'badToken'}); //Angular will need to act on this information. I.e., send them to the login page					
				}else{
					res.json({
						username: document.username,
						token: document.token
					});
				}
			}
		)
	}
});

router.post('/stripe', function(req, res, next){
	stripe.charges.create({
		 amount: req.body.amount,
		 currency: "usd",
		 source: req.body.stripeToken,
		 description: "Charge for " + req.body.email
		}).then((charge) => {
			res.json({
				success: "paid"
			});
		}, function(err) {
			res.json({
				failure: "failedPayment"
			});
		});
	});


module.exports = router;
