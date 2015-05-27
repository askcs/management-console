define(['controllers/controllers', 'config'], function (controllers, config) {
	'use strict';

	controllers.controller('monitors', 
		['$rootScope', '$scope', 'Monitors', 'Store', 'Groups', '$filter', 'moment', '$window', '$timeout', 
		function($rootScope, $scope, Monitors, Store, Groups, $filter, moment, $window, $timeout) {

			var monitors = Store('monitors').get('monitors');			
			$scope.groups = Store('network').get('groups');

			$scope.types = ['PHONE', 'SMS', 'APP', 'EMAIL'];
			$scope.type = {name: 'type', value:'All types'};
			$scope.alltypes = [$scope.type].concat($scope.types);
			$scope.states = ['OFF', 'ON'];
			$scope.state = $scope.states[0];			
			
			$scope.monitors = getMonitorsList();
			$scope.dmonitor = {};
			$scope.dmonitor.dataLoaded = true;

			$scope.selectedIndex = -1;
			
			$scope.frequencies = ['Day'];
			$scope.selFrequency = $scope.frequencies[0];
			$scope.loaded = false;

			angular.element('#timelinemain').hide();
			angular.element('#toolbar').hide();
			angular.element('.menus').hide();			

			function getIcon(mobileMedium) {
				switch (mobileMedium) {
					case 'APP': return 'fa-comment';
					break;

					case 'SMS': return 'fa-envelope';
					break;

					case 'EMAIL': return 'fa-inbox';
					break;

					case 'PHONE': return 'fa-phone';
				}
			}

			function getMonitorsList() {
				var monitorsList = [];
				var stateOn = ['UNKNOWN', 'MONITOR', 'ESCALATE'];

				_.each(monitors.data, function(monitor) {
					if (monitor.length > 1) {
						_.each(monitor, function (mnt) {
							mnt.imgClass = getIcon(mnt.mobileMedium);	
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
						monitor[0].imgClass = getIcon(monitor[0].mobileMedium);	
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

			$scope.loadMonitor = function (index, monitor) {
				$scope.selectedIndex = index;	
				$scope.dmonitor.dataLoaded = false;
				
				Monitors.get(monitor.name).then(function (result) {
					if (result)	{
						Store('monitors').save('monitor.'+monitor.name, result.data);
						$scope.dmonitor = Store('monitors').get('monitor.'+monitor.name);
						$scope.dmonitor.dataLoaded = true;
												
						selectMonitor($scope.dmonitor);	
					}
				});				
			}

			$scope.showToolbar = function () {				
				if ($scope.toolbarBtn == 'Change') {
					angular.element('#toolbar').show();
					$scope.toolbarBtn = $rootScope.ui.monitors.close_label;
				}else {
					angular.element('#toolbar').hide();
					$scope.toolbarBtn = $rootScope.ui.monitors.change_label;
				}
			}

			$scope.onSelect = function (items) {
				/*if (items.items[0] === 1) {
					$scope.toolbarBtn = $rootScope.ui.monitors.close_label;
					angular.element('#toolbar').show();
					$scope.$apply();
				}*/
				console.log(items);
			}

			function contentUpdate(item, callback) {
				alert('update' + angular.toJson(item));
			}

			function selectMonitor (monitor) {	
				angular.element('#toolbar').hide();						
				$scope.toolbarBtn = $rootScope.ui.monitors.change_label;
				angular.element('.menus').show();

				if (!angular.element('#timelinemain').is(':visible')) {
					angular.element('#timelinemain').show();
				}

				var selectedGroup = [];
				_.each(monitor.monitoringGroups, function(group) {
					var search = $filter('filter')($scope.groups, {uuid: group}, true);
					if (search.length) {
						selectedGroup.push(search[0]);
					}
				})
				$scope.groups.selectedGroup = selectedGroup;				

				var groups = [
			    {id: 0, content: ' ', title: 'wish'},
			    {id: 1, content: ' ', title: 'wish'},			    
			  ];

			  var current = {
			  	start: moment({ hour:0, minute:0 }).weekday(1).unix()*1000,
			  	end: moment({ hour:0, minute:0 }).weekday(8).unix()*1000
			  }

			  var wish_weekly = {
			  	id: 1,
			  	group:1,
			  	content: monitor.wish,
			  	start: current.start,
			  	end: current.end
			  }

			  var wish_once = {id: monitor.name, 
			  	group:0, 
			  	content: '', 
			  	start: current.start, 
			  	end: current.end, 
			  	type: 'background'
			  }

				var data = [ wish_once, wish_weekly ];
			  
			  var options = {					
					orientation: 'top',
					editable: true,
					stack: false,
					locale: 'en',
					groupOrder: function (a, b) {
			      return a.value - b.value;
			    },
			    min: current.start,
			    max: current.end,
			    onUpdate: contentUpdate
				};

				$scope.timeline = {
					data: data,
					options: options,
					groups: groups,
					events: {
						select: $scope.onSelect
					}					
				}
				
				$scope.range = {
					start: {
						date: moment(current.start).format('DD-MM-YYYY'),
						time: new Date(current.start).toString('HH:mm')
					},
					end: {
						date: moment(current.end).format('DD-MM-YYYY'),
						time: new Date(current.end).toString('HH:mm')
					}
				}
			}			

			$scope.removeGroup = function (item, monitor){				
				Monitors.deleteGroup(monitor, item.uuid)
				.then(function (result) {
					console.log(result);
				})
				//add message after deleting a group				
			}			

			$scope.setWish = function () {	
				angular.element('#monitors button[type=submit]').text($rootScope.ui.monitors.saving_label).attr('disabled', 'disabled');

				var range = {
					start: moment({ hour:0, minute:0 }).weekday(1).unix()*1000,
					end: moment({ hour:0, minute:0 }).weekday(8).unix()*1000
				}
				
				var wish = {
					start: range.start,
					end: range.end,
					wish: $scope.dmonitor.wish,
					occurence: 'ONCE'
				}
				
				Monitors.setWish($scope.dmonitor.name, wish)
				.then(function (result) {
					Monitors.query().then(function (monitors) {
						if (monitors) {
							Store('monitors').save('monitors', monitors);

							angular.element('#monitors button[type=submit]').text($rootScope.ui.monitors.save_label).removeAttr('disabled');
						}
					})
				})
			}

			$scope.saveUpdate = function() {			
				var groups = [], index;	
				
				angular.element('#monitors input[type=submit]').val($rootScope.ui.monitors.saving_label).attr('disabled', 'disabled');	

				_.each($scope.groups.selectedGroup, function (group) {
					index = $scope.dmonitor.monitoringGroups.indexOf(group.uuid);
					if (index === -1) {
						groups.push(group);						
					}
				})
									
				Monitors.mobileMedium($scope.dmonitor.name,
					{ mobilizeMedium: $scope.dmonitor.mobileMedium })
				.then (function (result) {
					Monitors.askfastAgentUrl($scope.dmonitor.name,
						{ askfastAgentUrl: $scope.dmonitor.askfastAgentUrl})					
					.then(function (agentUrl) {
						Monitors.askfastEscAgentUrl($scope.dmonitor.name,
							{ askfastEscalationAgentUrl: $scope.dmonitor.askfastEscalationAgentUrl })
						.then (function (agentEscUrl) {
							if (groups) {
								_.each($scope.groups.selectedGroup, function (group) {
									Monitors.addGroup($scope.dmonitor.name, 
										{groupId: group.uuid})
									.then(function(resGroup) {
										if (resGroup.error) {											
											console.warn('error ->', resGroup);
										}
									})
								})
							}
							Monitors.query().then(function (monitors) {
								if (monitors) {
									Store('monitors').save('monitors', monitors);
								}

								angular.element('#monitors input[type=submit]').val($rootScope.ui.monitors.save_label).removeAttr('disabled');
							})
								
						})
					})
				})	
			}

			$scope.callbackFunc = function(params) {
				$window.alert( angular.toJson(params));
			}
			
		}		
	]);
});