define(
	['controllers/controllers'],
	function (controllers) {
		'use strict';

		controllers.controller('exampleTestCtrl', function($rootScope, $scope){	
			$scope.exampleTestString = 'Controller testing works';	
		});
	}
);