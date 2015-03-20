define(['controllers/controllers'], function (controllers){
	'use strict';

	controllers.controller('domains', ['$scope', '$rootScope', '$location', 'Session', 'Store', 'Profile',
		function($scope, $rootScope, $location, Session, Store, Profile){
			angular.element('.navbar').show();
			angular.element('.topbar').show();

			Profile.get($rootScope.app.resources.uuid, true).then(function(result){
				if (result.error){
					console.warn('error get profile ->', result);	
				}
			});
		}
	]);
});