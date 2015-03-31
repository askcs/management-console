define(['controllers/controllers'], function (controllers){
	'use strict';

	controllers.controller('domains', ['$scope', '$rootScope', '$location', 'Session', 'Store',
		function($scope, $rootScope, $location, Session, Store){

			angular.element('.navbar').show();
			angular.element('.topbar').show();

			//console.log(Session.get());
		}
	]);
});