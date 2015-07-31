define(['controllers/controllers'], function (controllers){
	'use strict';

	controllers.controller('domainInformation', 
		['$rootScope', '$scope', '$location', 'Session', 'Store', 'Environment', '$timeout', 
		function ($rootScope, $scope, $location, Session, Store, Environment, $timeout) {

			var domain = Store('environment').get('domain');
			var geofence = Store('environment').get('geofence');
			var original = {};
			if (domain) $scope.domain = domain;
			
			$scope.geofence = {
				longitude: geofence.longitude,
				latitude: geofence.latitude,
				radius: geofence.radius
			}
			angular.copy($scope.geofence, original);
			
			//map
			$scope.map = {
				center: {
					latitude: $scope.geofence.latitude,
					longitude: $scope.geofence.longitude
				},
				zoom: 16,
				dragging: true,
				events: {},
				control: {}
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
          	$scope.geofence.longitude = newCenter.D;          	
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

					//recenter the map after looking for a geofence
					$scope.map.control.refresh({
						latitude: $scope.geofence.latitude, 
						longitude: $scope.geofence.longitude 
					});
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
				
				save($scope.geofence);
			}

			function save(geofence){					
				if (!angular.equals(geofence, original)) {					
					angular.element('#domain-information #submit')
					.val($rootScope.ui.domain.saving_label)
					.attr('disabled', 'disabled');
					
					Environment.saveGeofence({
						latitude: geofence.latitude,
						longitude: geofence.longitude,
						radius: geofence.radius
					})
					.then(function (result){
						if (result.error){
							console.warn('error -> ', result);
						} else {
							angular.copy(geofence,original);
							
							$scope.map.control.refresh({
								latitude: geofence.latitude, 
								longitude: geofence.longitude 
							});

							$scope.marker = {
								id: 0,
								coords: {
									latitude: geofence.latitude,
									longitude: geofence.longitude
								}
							}
							
							$scope.circle.radius = parseInt(geofence.radius, 10);

							angular.element('#domain-information #submit')
							.val($rootScope.ui.domain.save_label)
							.removeAttr('disabled');
						}
					});				
				}
			}
			
		}
	]);
});