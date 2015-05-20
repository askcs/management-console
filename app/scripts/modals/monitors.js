define(['services/services', 'config'], function (services, config) {
	'use strict';

	services.factory('Monitors', ["$resource", "$q", "User", "Store", function ($resource, $q, User, Store) {
		var Monitors = $resource();

		var Monitor = $resource(config.host + '/monitor/:uuid/:first/:second', {}, {
			addGroup: {
				method: 'POST',
				params: { first: 'monitorgroup' }
			},
			deleteGroup: {
				method: 'DELETE',
				params: { first: 'monitorgroup' }
			},
			mobileMedium: {
				method: 'PUT',
				params: { first: 'mobilizemedium' } 
			},
			askfastAgentUrl: {
				method: 'PUT',
				params: { first: 'askfastagenturl' }
			},
			askfastEscAgentUrl: {
				method: 'PUT',
				params: { first: 'askfastescalationagenturl' }
			},
			wish: {
				method: 'PUT',
				params: { first: 'wish' }
			}
		});

		Monitors.prototype.query = function () {
			var deferred = $q.defer();

			try {
				User._('monitors').then(function (result) {
					Store('monitors').save('monitors', result);

					deferred.resolve(result);
				});
			} catch (e) {
				console.warn('error -> ', e)
			}

			return deferred.promise;
		};

		Monitors.prototype.get = function (uuid) {
			var deferred = $q.defer();

			try {
				User._('monitor', { second: uuid }).then(function (result) {
					Store('monitors').save('monitor.'+uuid, result.data);

					deferred.resolve(result);
				});
			} catch (e) {
				console.warn('error with monitor call ->', e);
			}

			return deferred.promise;
		}

		Monitors.prototype.addGroup = function (uuid, groupId) {
			var deferred = $q.defer();

			try {
				Monitor.addGroup({uuid: uuid}, groupId, function (result) {
					deferred.resolve(result);
				})
			} catch (e) {
				console.warn('error adding groups to monitor ->', e);
			}

			return deferred.promise;
		}

		Monitors.prototype.deleteGroup = function (uuid, groupId) {
			var deferred = $q.defer();

			try {
				Monitor.deleteGroup({uuid: uuid, second: groupId}, function (result) {
					deferred.resolve(result);
				});
			} catch (e) {
				console.warn('error deleting groups to monitor ->', e);
			}

			return deferred.promise;
		}

		Monitors.prototype.mobileMedium = function (uuid, mobileMedium) {
			var deferred = $q.defer();

			try {
				Monitor.mobileMedium({uuid: uuid}, mobileMedium, function (result) {
					deferred.resolve(result);
				});
			} catch (e) {
				console.warn('error update mobile medium ->', e)
			}

			return deferred.promise;
		}

		Monitors.prototype.askfastAgentUrl = function (uuid, url) {
			var deferred = $q.defer();

			try {
				Monitor.askfastAgentUrl({uuid:uuid}, url, function (result) {
					deferred.resolve(result);
				});
			} catch (e){
				console.warn('error update askfastagenturl ->', e);
			}

			return deferred.promise;
		}

		Monitors.prototype.askfastEscAgentUrl = function (uuid, url) {
			var deferred = $q.defer();

			try {
				Monitor.askfastEscAgentUrl({uuid:uuid}, url, function(result) {
					deferred.resolve(result);
				})
			} catch (e) {
				console.warn('error update askfastescalationagenturl ->', e);
			}

			return deferred.promise;
		}

		Monitors.prototype.setWish = function (uuid, wish) {
			var deferred = $q.defer();

			try {
				Monitor.wish({uuid:uuid}, wish, function (result) {
					deferred.resolve(result);
				});
			} catch (e) {
				console.warn('error set wish : ', e);
			}

			return deferred.promise;
		}		

		return new Monitors();
	}]);
});