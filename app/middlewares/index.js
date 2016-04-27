var tokenVerifyMiddleware = require('./tokenVerify');

var Middleware = function(){
	
	this.api = [
		tokenVerifyMiddleware.verifyToken
	];

};

module.exports = (function(){

	var instance = new Middleware();

	return instance;

})();