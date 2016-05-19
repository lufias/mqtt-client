var express = require('express');
var router = express.Router();
var async = require('async');

// load middleware
var apiMiddleware = require('../app/middlewares').api;

// load the repos required
var sysauth = require('../app/repositories/authentication/sysauth');
var userRepo = require('../app/repositories/user/user');
var jwtRepo = require('../app/repositories/authentication/token-handler');

// load utilities
var asyncErrorHandler = require('../app/utilities/ErrorHandler/AsyncErrorHandler');

/*READ Token out of header*/
router.get('/token/read', apiMiddleware, function(req, res){
	
	var token = req.query.ctoken;
	
	async.waterfall([
		function(callback){
			jwtRepo.decodeToken(callback, token);
		}
	], function(err, result){
		asyncErrorHandler.handleError(err, res);
		return res.json(result);
	});
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
				callback({show:true, code:1001, message:"The user already exist in system", err:'ModelFoundException'});
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
			jwtRepo.generateToken(callback, {uid:dbUser._id}, {expiresIn:'30 days'});
		}
	], function(err, result){				
		asyncErrorHandler.handleError(err, res);

		res.json({status:1, token:result.token});
	});

});

router.post('/token/refresh', function(req, res){

	// get the required parameter
	var token = req.body.token;

	// get the new refreshed token
	async.waterfall([
		function(callback){
			jwtRepo.refreshToken(callback, token, {expiresIn:'30 days'});
		}
	], function(err, result){
		asyncErrorHandler.handleError(err, res);
		res.json({status:1, token:result.token});
	});
	
});

router.get('/pub-user-change', function(req, res){

	var mqtt    = require('mqtt');
	var client  = mqtt.connect('mqtt://128.199.199.17:1883',{
			protocolId: 'MQIsdp',
			protocolVersion: 3 
	});

	client.on('connect', function () {		
		client.publish('user2/notifications/namechange/user/1', 'New UserName', {retain: true, qos: 1}, function(){
			console.log("send");		
		});

		client.end();
	});

	return res.json({status:'OK'});

});

router.post('/remove-topic', function(req, res){

	var mqtt    = require('mqtt');
	var client  = mqtt.connect('mqtt://128.199.199.17:1883', {
			protocolId: 'MQIsdp',
			protocolVersion: 3 
			});

	var topic = req.body.topic;

	client.on('connect', function () {		
		client.publish(topic, '', {retain: true, qos: 1});
		client.end();
	});

})

module.exports = router;
