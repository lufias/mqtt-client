var q = require('q');
var userService = require('../../db-services/User');

var SysAuth = function(){


	this.checkUserExist = function(callback, email){		

		// send request to service to see if the user exist
		userService.getUserByEmail(email).then(
			function(result){
				if(result.length){
					callback(null, true);
				}else{
					callback(null, false);
				}
			},
			function(err){
				callback(err);
			}
		);
	};

	this.registerUser = function(callback, email, password){		
		userService.registerUser(email, password).then(
			function(result){
				callback(null, result);
			},
			function(err){
				callback(err);
			}
		);
	};

	this.authenticatePassword = function(callback, password, hashed){		

		// require password hasher
		var bcrypt = require('bcrypt');		
		var saltRounds = 10;		

		if(bcrypt.compareSync(password, hashed)){
			callback(null, true);
		}
		else{
			// show error to client
			callback({show:true, code:1003, message:"Password authentication failed"});
		}
	};	

};

module.exports = (function(){

	var instance = new SysAuth();

	return instance;

})();