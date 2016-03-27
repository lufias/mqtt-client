var Utilities = function(){

	var cfg = require('config');
	var jwt = require('jsonwebtoken');
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

};


module.exports = (function(){

	var instance = new Utilities();

	return instance;

})();