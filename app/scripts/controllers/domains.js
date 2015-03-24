define(['controllers/controllers'], function (controllers){
	'use strict';

	controllers.controller('domains', ['$scope', '$rootScope', '$location', 'Session', 'Store', 'Profile',
		function($scope, $rootScope, $location, Session, Store, Profile){
			angular.element('.navbar').show();
			angular.element('.topbar').show();

			
		}
	]);
});