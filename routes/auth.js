var express = require('express');
var router = express.Router();
var jwt = require('../app/utilities/jwt/jsonwebtoken');
var async = require('async');
var bugsnag = require('bugsnag');

// load the repos required
var sysauth = require('../app/repositories/authentication/sysauth');
var userRepo = require('../app/repositories/user/user');
var jwtRepo = require('../app/repositories/authentication/token-handler');

// load utilities
var asyncErrorHandler = require('../app/utilities/ErrorHandler/AsyncErrorHandler');

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

// Registration manually into the system without external services or providers
router.post('/system-register', function(req, res){
	
	// get the required parameter
	var email = req.body.email;
	var password = req.body.password;

	// load the repos required
	var sysauth = require('../app/repositories/authentication/sysauth');

	async.waterfall([
		// make sure the user did not yet exist in the system
		function(callback){
			sysauth.checkUserExist(callback, email);
		},
		function(userExist, callback){
			if(userExist){
				// show error to client
				callback({show:true, code:1001, message:"The user already exist in system"});
			}
			else{
				// continue adding user into the system
				sysauth.registerUser(callback, email, password);
			}
		}
		
	], function(err, result){
		
		asyncErrorHandler.handleError(err, res);

		res.json({status:1, message:'User has been successfully registered into the system'});
	})
	
});

router.post('/system-authenticate', function(req,res){

	// get the required parameter
	var email = req.body.email;
	var password = req.body.password;

	// properties to be used later on
	var dbUser = null;

	async.waterfall([
		// make sure the user did exist in the system
		function(callback){
			userRepo.getUserByEmail(callback, email);
		},
		function(results, callback){
			dbUser = results[0].user;			
			sysauth.authenticatePassword(callback, password, dbUser.properties.password);
		},
		function(result, callback){
			jwtRepo.generateToken(callback, {uid:dbUser._id}, {expiresIn:'15 days'});
		}
	], function(err, result){		
		
		asyncErrorHandler.handleError(err, res);

		res.json({status:1, token:result.token});
	});

});





module.exports = router;