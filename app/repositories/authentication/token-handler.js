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

	this.decodeToken = function(callback, token){		
		jwt.decodeToken(token).then(
			function(result){				
				callback(null, result);
			},
			function(err){
				
				if(err.name === 'TokenExpiredError'){
					callback({show:true, code:1004, message:"Token expires"});	
				}
				else{
					callback(err);
				}				
				
			}
		);
	};

	this.refreshToken = function(callback, token, options){
		jwt.refreshToken(token, options).then(
			function(result){
				callback(null, {token:result});
			},
			function(){
				callback(err);
			}
		);
	};

};

module.exports = (function(){

	var instance = new TokenHandler();

	return instance;

})();