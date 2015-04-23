define(['services/services', 'config'], function (services, config) {
	'use strict';

	services.factory('Environment', ["$rootScope", "$resource", "$q", "User", "Store", function ($rootScope, $resource, $q, User, Store) {
		var Environment = $resource();

		var Geofence = $resource(config.host + '/:first', {}, {
			get: {
				method: 'GET',
				params: { first: 'geofence' }
			},
			save: {
				method: 'PUT',
				params: { first: 'geofence' },
				isArray: true
			}
		});
		
		Environment.prototype.domain = function () {
			return User._('domain').then(function (result) {
				var domain = result.data[0];

				Store('environment').save('domain', domain);

				$rootScope.app.environment.domain = domain;

				return domain;
			});
		};

		Environment.prototype.geofence = function () {
			var deferred = $q.defer();

			Geofence.get(function (result){
				Store('environment').save('geofence', result);

				$rootScope.app.environment.geofence = result;
				//console.log(result);
				deferred.resolve(result);
			},
			function(error){
				deferred.resolve( { error: error} );
			});

			return deferred.promise;
		}

		Environment.prototype.saveGeofence = function ( geofence ) {
			var deferred = $q.defer();

			Geofence.save(geofence,
			function (result) {

				//save to local-storage after update
				Environment.prototype.geofence().then(function(geofence){
					if (!geofence){
						console.warn('error => ', geofence)
					}
				});

				deferred.resolve(result);
			},
			function(error){
				deferred.resolve({ error: error });
			});

			return deferred.promise;
		}

		Environment.prototype.setup = function () {
			var deferred = $q.defer();

			var queue = [
				Environment.prototype.domain(),
				Environment.prototype.geofence()
			];

			try {
				$q.all(queue).then(function (results) {
					deferred.resolve(results);
					//console.log(results);
				});
			} catch (e) {
				console.warn('Something wrong with setting up domain and geofence : ', e);
			}

			return deferred.promise;
		}

		return new Environment();

	}]);
});