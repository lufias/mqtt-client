var q = require('q');
var userService = require('../../db-services/User');

var SysAuth = function(){


	this.checkUserExist = function(callback, email){		

		// send request to service to see if the user exist
		userService.checkUserExist(email).then(
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
};

module.exports = (function(){

	var instance = new SysAuth();

	return instance;

})();