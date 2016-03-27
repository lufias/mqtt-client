var Utilities = function(){

	var cfg = require('config');
	var jwt = require('json-web-token');
	var q = require('q');	

	this.encodeToken = function(data){

		var deferred = q.defer();

		var key = cfg.jwt.key;	
				
		jwt.encode(key.trim(), data, function(err, token){
			if(err){				
				deferred.reject(err);
			}
			else{				
				deferred.resolve(token);
			}
		});

		return deferred.promise;
		
	};

	this.decodeToken = function(data){

		var deferred = q.defer();

		var key = cfg.jwt.key;			

		jwt.decode(key.trim(), data.replace(/"/g, ""), function(err, decoded){
			if(err){				
				deferred.reject(err);
			}
			else{
				deferred.resolve(decoded);
			}
		});

		return deferred.promise;		
	}

};


module.exports = (function(){

	var instance = new Utilities();

	return instance;

})();