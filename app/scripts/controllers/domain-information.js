define(['controllers/controllers'], function (controllers){
	'use strict';

	controllers.controller('domainInformation', ['$rootScope', '$scope', '$location', 'Session', 'Store', 'Environment',
		function ($rootScope, $scope, $location, Session, Store, Environment) {

			var domain = Store('environment').get('domain');
			var geofence = Store('environment').get('geofence');

			if (domain) $scope.domain = domain;
			if (geofence) $scope.geofence = geofence;

			$scope.alert = {
        domain: {
          display: false,
          message: ''
        }
      };

			$scope.update = function () {
				if (!$scope.geofence.latitude || !$scope.geofence.longitude || !$scope.geofence.radius){
					$scope.alert = {
              domain: {
                display: true,
                message: $rootScope.ui.domain.alert_fillfiled
              }
          };
					return false;
				}
				//alert($scope.geofence.radius);
				save($scope.geofence.latitude, $scope.geofence.longitude, $scope.geofence.radius);
			}

			function save(latitude, longitude, radius){
				Environment.saveGeofence({
					latitude: latitude,
					longitude: longitude,
					radius: radius
				}).then(function (result){
					if (result.error){
						console.warn('error -> ', result);
					} else {
						alert('new geofence already updated');
					}
				});	
			}
			
		}
	]);
});