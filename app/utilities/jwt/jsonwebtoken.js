var Utilities = function(){

	var cfg = require('config');
	var jwt = require('jsonwebtoken');
	var jwtRe = require('jwt-refresh-token');
	var q = require('q');	

	this.encodeToken = function(data, options){

		var deferred = q.defer();

		var key = cfg.jwt.key;

		deferred.resolve(jwt.sign(data, key, options));	

		return deferred.promise;
		
	};

	this.decodeToken = function(token){	

		var deferred = q.defer();

		var key = cfg.jwt.key;

		try {
			var decoded = jwt.verify(token, key);
			deferred.resolve(decoded);
		} catch(err) {
		  	deferred.reject(err);
		}				

		return deferred.promise;		
	}

	this.refreshToken = function(token, options){
		var deferred = q.defer();

		try{
			var newToken = jwtRe.refresh(token, cfg.jwt.key, options);
			deferred.resolve(newToken);
		}
		catch(err){
			deferred.reject(err);
		}

		return deferred.promise;
	};

};


module.exports = (function(){

	var instance = new Utilities();

	return instance;

})();