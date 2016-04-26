var q = require('q');
var jwt = require('../../utilities/jwt/jsonwebtoken');

var TokenHandler = function(){

	this.generateToken = function(callback, data, options){
		// generate token
		jwt.encodeToken(data, options).then(
			function(result){
				callback(null, {token:result})													
			},
			function(err){	
				callback(err);
			}
		);	
	};

};

module.exports = (function(){

	var instance = new TokenHandler();

	return instance;

})();