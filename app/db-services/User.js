
var cfg = require('config');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(cfg.neo4j.url);
var q = require('q');

var User = function(){

	this.updateUser = function(user){		

		var deferred = q.defer();

		var query = [
			'MERGE (user:CXPerson {email:{email}})',
			'SET user.email={email}, user.name={name}, user.profilepic={profilepic}',
			'RETURN user'
		].join('\n');

		var params = {
			email:user.email,
			name:user.name,
			profilepic:user.profilepic

		}		

		db.cypher({
			query:query,
			params:params,
		}, function (err, results) {			
			if (err) deferred.reject({err:err});
			deferred.resolve(results);
		});			

		return deferred.promise;

	};

	this.checkUserExist = function(email){

		var deferred = q.defer();

			var query = [
				'MATCH (user:CXPerson {email:{email}}) RETURN user'
			].join('\n');

			var params = {
				email:email
			};

			db.cypher({
				query:query,
				params:params
			}, function(err, results){
				if (err) deferred.reject({err:err});
				deferred.resolve(results);
			})

		return deferred.promise;
	};
};

module.exports = (function(){

	var instance = new User();

	return instance;

})();