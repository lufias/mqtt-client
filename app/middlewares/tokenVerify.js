var jwtRe = require('../repositories/authentication/token-handler');
var async = require('async');
var jwtRepo = require('../repositories/authentication/token-handler');
var asyncErrorHandler = require('../utilities/ErrorHandler/AsyncErrorHandler');

var Tokenverify = function(){
	this.verifyToken = function(req, res, next){
		var ctoken = req.headers.ctoken;
		
		async.waterfall([
		function(callback){
			jwtRepo.decodeToken(callback, ctoken);
		}
		], function(err, result){			
			asyncErrorHandler.handleError(err, res);
		});

		next();
	}
};

module.exports = (function(){

	var instance = new Tokenverify();

	return instance;

})();