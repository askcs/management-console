define(['controllers/controllers', 'config'], function (controllers, config) {
	'use strict';

	controllers.controller('monitors', 
		['$rootScope', '$scope', 'Monitors', 'Store',
		function($rootScope, $scope, Monitors, Store) {

			var monitors = Store('domain').get('monitors');			

			$scope.types = ['PHONE', 'SMS', 'APP', 'EMAIL'];
			$scope.type = 'All types';
			$scope.states = ['OFF', 'ON'];
			$scope.state = $scope.states[0];			

			$scope.monitors = getMonitorsList();
		
			function getMonitorsList() {
				var monitorsList = [];
				var stateOn = ['UNKNOWN', 'MONITOR', 'ESCALATE'];

				_.each(monitors.data, function(monitor) {
					if (monitor.length > 1) {
						_.each(monitor, function (mnt) {
							mnt.imgClass = 'monitor-icon-' + angular.lowercase(mnt.mobileMedium);	
							if (mnt.isRunning == 'OFF') {
								mnt.state = mnt.isRunning;
							}else{
								mnt.state = 'ON';
							}					
							monitorsList.push(mnt);							
						})
					}else{
						if (monitor[0].isRunning == 'OFF') {
								monitor[0].state = monitor[0].isRunning;
							}else{
								mnt.state = 'ON';
							}
						monitor[0].imgClass = 'monitor-icon-' + angular.lowercase(monitor[0].mobileMedium);	
						monitorsList.push(monitor[0]);					
					}
				})
				return monitorsList;
			}

			$scope.getMonitors = function() {				
				if ($scope.state) {					
					$scope.monitors = getMonitorsFilter($scope.state, $scope.type);
				}
			}

			function getMonitorsFilter(state, type) {
				var mntList = [];				
				var monitorsList = getMonitorsList();
				
				if (!type || type == 'All types') {
					_.each(monitorsList, function(monitor) {
						if (monitor.state == state) {
							mntList.push(monitor);
						}
					})
				}else{
					_.each(monitorsList, function(monitor) {
						if ((monitor.state == state) && (monitor.mobileMedium == type)) {
							mntList.push(monitor);
						}
					})
				}
				
				return mntList;			
			}

		}		
	]);
});