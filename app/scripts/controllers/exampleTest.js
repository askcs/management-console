define(
	['controllers/controllers'],
	function (controllers) {
		'use strict';

		controllers.controller('exampleTestCtrl', ["$rootScope", "$scope", function($rootScope, $scope){	
			$scope.exampleTestString = 'Controller testing works';	
		}]);
	}
);