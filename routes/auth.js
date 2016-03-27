var express = require('express');
var router = express.Router();
var jwt = require('../app/utilities/jwt/jsonwebtoken');
var userModel = require('../app/models/User');


/*READ Token out of header*/
router.get('/token/read', function(req, res){
	var token = req.get('ctoken');
	var data = jwt.decodeToken(token).then(
		function(result){
			return res.json({data:result});
		},
		function(err){
			return res.json({error:err});
		}
	);	
});

// User send in the login request
// Update user data in record
// Generate and send token
router.post('/authenticate', function(req, res){	

	// get user data coming in from the request
	var user = {
		email: req.param('email'),
		name: req.param('name'),
		profilepic: req.param('profilepic')
	}

	// generate token function
	var generateToken = function(data){
		
		if(data.status){
			var user = data.user[0].user;				

			// generate token
			jwt.encodeToken({uid:user._id}, {expiresIn:'5'}).then(
				function(result){
					return res.json({token:result});										
				},
				function(err){	
					return res.json(err);										
				}
			);				
		}
		else{
			return res.json(data.error);			
		}
		
	};

	// update the user data, or create one if it not yet exist
	userModel.updateUser(user)
	.then(
		function(user){
			return {status:1, user:user};
		},
		function(err){
			return {status:0, error:err};					
		}
	)
	.then(generateToken);	

	// return user id
	


})

module.exports = router;