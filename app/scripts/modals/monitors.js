define(['services/services', 'config'], function (services, config) {
	'use strict';

	services.factory('Monitors', function ($resource, $q, User, Store) {
		var Monitors = $resource();

		Monitors.prototype.get = function () {
			var deferred = $q.defer();

			try {
				User._('monitors').then(function (result) {
					Store('domain').save('monitors', result);

					deferred.resolve(result);
				});
			} catch (e) {
				console.warn('error -> ', e)
			}

			return deferred.promise;
		};

		return new Monitors();
	});
});