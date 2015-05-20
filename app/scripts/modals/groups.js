define(['services/services','config'],
	function (services, config) {
		'use strict';

		services.factory('Groups', 
			['$resource', '$q', '$rootScope', 'Store', 
			function($resource, $q, $rootScope, Store){
				var Groups = $resource(config.host + '/network/:action/:id', {}, {
						query: {
							method: 'GET',
							params: {},
							isArray: true
						}
					}
				);

				Groups.prototype.query = function() {
					var deferred = $q.defer();

					Groups.query(function (result) {
						Store('network').save('groups', result);
						
						deferred.resolve(result);
					},
					function (error) {
						deferred.resolve({error: error});
					});

					return deferred.promise;					
				}

				return new Groups();
			}
		]);
	}
);