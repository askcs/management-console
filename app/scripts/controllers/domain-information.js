define(['controllers/controllers'], function (controllers){
	'use strict';

	controllers.controller('domainInformation', ['$rootScope', '$scope', '$location', 'Session', 'Store', 'Environment', 
		function ($rootScope, $scope, $location, Session, Store, Environment) {

			var domain = Store('environment').get('domain');
			var geofence = Store('environment').get('geofence');

			if (domain) $scope.domain = domain;
			if (geofence) $scope.geofence = geofence;

			//map
			$scope.map = {
				center: {
					latitude: $scope.geofence.latitude,
					longitude: $scope.geofence.longitude
				},
				zoom: 16,
				dragging: true,
				events: {}
			};
			
			//marker
			$scope.marker = {
				id: 0,
				coords: {
					latitude: $scope.geofence.latitude,
					longitude: $scope.geofence.longitude
				},
				options: { draggable:true },
				events: { 
          dragend: function(marker, eventName, args) {
          	var lat = marker.getPosition().lat();
          	var lon = marker.getPosition().lng();
          	
          	$scope.geofence.latitude = lat;
          	$scope.geofence.longitude = lon;
          }
				}
			};
			
			//circle
			$scope.circle = {
				radius: $scope.geofence.radius,
				stroke: {
					color: '#08B21F',
					weight: 1.5,
					opacity: 1
				},
				fill: {
					color: '#08B21F',
					opacity: 0.5
				},
				geodesic: true, 
        draggable: true, 
        clickable: true, 
        editable: true, 
        visible: true,
        events: { 
        	radius_changed: function(circle, eventName, args) {                
            $scope.geofence.radius = circle.radius;
          },
          center_changed: function(circle, eventName, model, args){
          	var newCenter = circle.getCenter();
          	$scope.geofence.latitude = newCenter.k;
          	$scope.geofence.longitude = newCenter.B;
          }
        }
			};

			//searchBox
			var events = {
				places_changed: function (searchBox) {
					var place = searchBox.getPlaces();
					if (!place || place == 'undefined' || place.length == 0) {
						return;
					}

					$scope.geofence.latitude = place[0].geometry.location.lat();
					$scope.geofence.longitude = place[0].geometry.location.lng();

					var newMarker = {
						id: 0,
						coords: {							
							latitude: $scope.geofence.latitude,
							longitude: $scope.geofence.longitude
						},
						options: {
							draggable:true
						},
						events: {
		          dragend: function(marker, eventName, args) {
		          	var lat = marker.getPosition().lat();
		          	var lon = marker.getPosition().lng();
		          	$scope.geofence.latitude = lat;
		          	$scope.geofence.longitude = lon;
		          }
						}
					};

					$scope.marker = newMarker;
				}
			};

			$scope.searchBox = { 
				template: 'searchbox.tpl.html', 
				events:events, 
				parentdiv:'searchBoxParent',
			};

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