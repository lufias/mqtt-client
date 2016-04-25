var express = require('express');
var router = express.Router();
var jwt = require('../app/utilities/jwt/jsonwebtoken');
var userModel = require('../app/db-services/User');
var async = require('async');


/*READ Token out of header*/
router.get('/token/read', function(req, res){
	var token = req.get('ctoken');
	var data = jwt.decodeToken(token).then(
		function(result){
			return res.json({data:result});
		},
		function(err){
			return res.json({error:1, data:err});
		}
	);	
});

// User send in the login request
// Update user data in record
// Generate and send token
router.post('/service-authenticate', function(req, res){	

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
			jwt.encodeToken({uid:user._id}, {expiresIn:'15 days'}).then(
				function(result){
					return res.json({error:0, token:result});										
				},
				function(err){	
					return res.json({error:1, data:data.error});										
				}
			);				
		}
		else{
			return res.json({error:1, data:data.error});			
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

router.post('/system-register', function(req, res){
	
	// get the required parameter
	var user = {
		email: req.body.email,
		password: req.body.password
	}

	// load the repos required
	sysauth = require('../app/repositories/authentication/sysauth');

	
	async.waterfall([
		// make sure the user did not yet exist in the system
		function(callback){
			sysauth.checkUserExist(callback, user.email);
		},
		function(userExist, callback){
			if(userExist){
				
			}
			else{
				callback({errlevel:1, message:"The user already exist in system"});
			}
		}
		
	], function(err, result){
		if(err){return res.json({status:0, errlevel:2, err:err})}
		return res.json({status:1, result:result});
	})
	
})

router.get('/status-check', function(req, res){
	return res.json({status:'OK'});			
});



module.exports = router;