define(['services/services', 'config'], function (services, config) {
	'use strict';

	services.factory('Profile', function ($rootScope, $resource, $q, md5, Store){
			var Profile = $resource(config.host + '/node/:id/:section', {}, {
				get: {
					method: 'GET',
					params: { id: '', section: 'resource' }
				},
				save: {
					method: 'PUT',
					params: {section: 'resource'}
				}
			});

 			Profile.prototype.get = function (id, localize) {
 				var deferred = $q.defer();

 				Profile.get({id: id}, function (result) {
 					result.role = (result.role || result.role == 0) ? result.role : 3;

 					if (id == $rootScope.app.resources.uuid)
 						$rootScope.app.resource = result;

 					if (localize)
 						Store('user').save('resources', result);

 						deferred.resolve({resources: result});
 				});	

 				return deferred.promise;
 			};

 			return new Profile();
		});
});