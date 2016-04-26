var AsyncErrorHandler = function(){

	this.handleError = function(err, res){
		if(err && err.show){return res.json({status:0, code:err.code, message:err.message})}
		
		else if(err && !err.show){
			bugsnag.notify(new Error("Server Error"), err); 
			res.status(err.status || 500);
			res.json({status:0, code:1000, message:"Server Error"}); 
		}
	};

};


module.exports = (function(){

	var instance = new AsyncErrorHandler();

	return instance;

})();