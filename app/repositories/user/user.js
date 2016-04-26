var q = require('q');
var userService = require('../../db-services/User');

var UserRepo = function(){
	this.getUserByEmail = function(callback, email){
		userService.getUserByEmail(email).then(
			function(result){
				
				if(!result.length){
					// show error to client
					callback({show:true, code:1002, message:"The user not exist in system"});
				}

				callback(null, result);
			},
			function(err){
				callback(err);
			}
		);
	};
};

module.exports = (function(){

	var instance = new UserRepo();

	return instance;

})();