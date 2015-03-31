define(['angular-mocks',
	'app',
	'controllers/exampleTest'
	],
	function() {
		'use strict';

		describe('Example Test Controller', function () {
			
			beforeEach(module('controllers'));

			var exampleCtrl, scope;

			beforeEach(inject(function ($controller, $rootScope){
				scope = $rootScope.$new();
				exampleCtrl = $controller('exampleTestCtrl', {
					$scope: scope
				});
			}));

			it('should assign a string to the scope', function() {
				expect(scope.exampleTestString).toBe('Controller testing works');
			});
		});
	}
);