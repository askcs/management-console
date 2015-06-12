define(['controllers/controllers', 'config'], function (controllers, config) {
	'use strict';

	controllers.controller('monitors', 
		['$rootScope', '$scope', 'Monitors', 'Store', 'Groups', '$filter', 'moment', '$window', '$timeout', 
		function($rootScope, $scope, Monitors, Store, Groups, $filter, moment, $window, $timeout) {
			
			$scope.groups = Store('network').get('groups');

			var current = {
			  start: moment({ hour:0, minute:0 }).weekday(1).unix()*1000,
			 	end: moment({ hour:0, minute:0 }).weekday(8).unix()*1000
			},
			itemGroup;

			$scope.types = ['PHONE', 'SMS', 'APP', 'EMAIL'];
			$scope.type = {name: 'type', value:'All types'};
			$scope.alltypes = [$scope.type].concat($scope.types);
			$scope.states = ['OFF', 'ON'];
			$scope.state = $scope.states[0];			
			
			$scope.monitors = getMonitorsList();
			$scope.dmonitor = {};
			$scope.dmonitor.dataLoaded = true;

			$scope.selectedIndex = -1;
			
			$scope.frequencies = ['Day', 'Week', 'Month'];
			$scope.selFrequency = $scope.frequencies[1];
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
				var monitors = Store('monitors').get('monitors');	

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
					$scope.selectedIndex = -1;
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

				var options = {
					uuid: monitor.name,
					start: current.start/1000,
					end: current.end/1000
				}

				Monitors.get(monitor.name).then(function (result) {
					if (result)	{
						Store('monitors').save('monitor.'+monitor.name, result.data);
						
						Monitors.getWishes(options).then(function (wishes) {
							$scope.wishes = wishes;							
							$scope.dmonitor = Store('monitors').get('monitor.'+monitor.name);
							$scope.dmonitor.dataLoaded = true;
												
							selectMonitor($scope.dmonitor);	
						});						
					}
				});				
			}

			$scope.showToolbar = function () {				
				angular.element('#saveWish').attr('disabled', 'disabled');
				angular.element('#delete').attr('disabled', 'disabled');

				if ($scope.toolbarBtn == 'Change') {
					angular.element('#toolbar').show();
					$scope.toolbarBtn = $rootScope.ui.monitors.close_label;
				}else {
					angular.element('#toolbar').hide();
					$scope.toolbarBtn = $rootScope.ui.monitors.change_label;
				}
			}								

			function timeline(wishes) {				
				var groups = [
			    {id: 'event', content: 'Event', title: 'wish'},
			    {id: 'weekly', content: 'Weekly', title: 'wish'},			    
			  ],
			  data=[],
			  item;			 

			  //check weekly and event timeline
			  _.each(wishes, function (wish) {
			  	var occurence = wish.value.split('"');			  	
			  	if (occurence[1] === 'weekly') {
			  		item = {
			  			id: wish.idx,
			  			group: 'weekly',
				  		type: 'range',
				  		start: wish.start*1000,
				  		end: wish.end*1000,
				  		content: occurence[3]
				  	}
			  	}else{
			  		if (occurence[1] === 'event') {
			  			item = {
			  				id: wish.idx, 
						  	group:'event', 			  	
						  	start: wish.start,
						  	end: wish.end,
						  	type: 'range',
						  	content: occurence[3]
			  			}			  			
			  		}
			  	}
			  	data.push(item);			  			
			  });			 
			  
			  //timeline options
			  var options = {					
					orientation: 'top',
					editable: {
				    add: false,         
				    updateTime: true,  
				    updateGroup: false, 
				    remove: false       
				  },
					stack: true,
					locale: 'en',
					groupOrder: function (a, b) {
			      return a.value - b.value;
			    },
			    min: current.start,
			    max: current.end			    
				};
				
				return $scope.timeline = {
					data: data,
					options: options,
					groups: groups,
					events: {
						select: timelineOnSelect
					}					
				}
			}

			function selectMonitor (monitor) {								
				if (!angular.element('#timelinemain').is(':visible')) {
					angular.element('#timelinemain').show();
				}

				$scope.toolbarBtn = $rootScope.ui.monitors.change_label;
				angular.element('.menus').show();
		
				var selectedGroup = [];
				_.each(monitor.monitoringGroups, function(group) {
					var search = $filter('filter')($scope.groups, {uuid: group}, true);
					if (search.length) {
						selectedGroup.push(search[0]);
					}
				})
				$scope.groups.selectedGroup = selectedGroup;				

				//timeline
				timeline($scope.wishes);
			}					
	
			var timelineOnSelect = function (id) {
				var item = $filter('filter')($scope.timeline.data, { id: id.items[0] }, true);								
				angular.element('#delete').hide();
				angular.element('#saveWish').removeAttr('disabled');

				//get timeline item id
				$scope.idx = id.items[0];			

				if ($scope.idx){
					$scope.$apply(
						function () {
							$scope.toolbarBtn = $rootScope.ui.monitors.close_label;

							$scope.wish = item[0].content;

							if (item[0].group == 'weekly'){
								$scope.range = {
									start: {
										date: $scope.timeline.options.min,
										time: new Date($scope.timeline.options.min).toString('HH:mm')
									},
									end: {
										date: $scope.timeline.options.max,
										time: new Date($scope.timeline.options.max).toString('HH:mm')
									}
								}
							}else{	
								$scope.range = {
									start: {
										date: item[0].start,
										time: new Date(item[0].start).toString('HH:mm')
									},
									end: {
										date: item[0].end,
										time: new Date(item[0].end).toString('HH:mm')
									}
								}
							}
						}
					);
				
					angular.element('#toolbar').show();				

					if (item[0].group === 'weekly') {
						angular.element('#delete').show();
						angular.element('#delete').removeAttr('disabled');

						itemGroup = 'weekly';
						angular.element('.inputdate').attr('disabled', 'disabled');
						angular.element('.inputtime').attr('disabled', 'disabled');				
					}else{
						itemGroup = 'event';
						angular.element('.inputdate').removeAttr('disabled');
						angular.element('.inputtime').removeAttr('disabled');
					}
				}else{	//no items selected					
					angular.element('#saveWish').attr('disabled', 'disabled');
					angular.element('#delete').attr('disabled', 'disabled');
				}
			}

			$scope.deleteItem = function () {				
				var wish = {
						wish: '',
						start: current.start,
						end: current.end,
						occurence: 'WEEKLY'				
					}
				
				var options = {
					uuid: $scope.dmonitor.name,
					start: current.start/1000,
					end: current.end/1000
				}

				angular.element('#monitors #delete')
				.text($rootScope.ui.monitors.deleting_label)
				.attr('disabled', 'disabled');

				Monitors.setWish($scope.dmonitor.name, wish)
				.then(function () {
					Monitors.query()
					.then(function (monitors) {
						$scope.monitors = getMonitorsList();

						Monitors.getWishes(options)
						.then(function (wishes) {
							$scope.wishes = wishes;
							timeline($scope.wishes);
							$scope.wish = 0;
							$scope.monitors = getMonitorsList();

							angular.element('#monitors #delete')
							.text($rootScope.ui.monitors.delete_label)
							.removeAttr('disabled');
						})
					})					
				})
			}

			$scope.removeGroup = function (item, monitor){				
				Monitors.deleteGroup(monitor, item.uuid)
				.then(function (result) {
					console.log(result);
				})
				//add message after deleting a group				
			}			

			$scope.setWish = function () {	
				angular.element('#monitors #saveWish')
				.text($rootScope.ui.monitors.saving_label)
				.attr('disabled', 'disabled');

				var wish;
			
				if (itemGroup === 'event'){
					wish = {
						wish: $scope.wish,
						start: Date.parse($scope.range.start.time),
						end: Date.parse($scope.range.end.time),
						occurence: 'ONCE'
					}										
				}else{
					wish = {
						wish: $scope.wish,
						start: current.start,
						end: current.end,
						occurence: 'WEEKLY'				
					}
				}			

				//set options to get the new wishes
				var options = {
					uuid: $scope.dmonitor.name,
					start: current.start/1000,
					end: current.end/1000
				}
				
				Monitors.setWish($scope.dmonitor.name, wish)
				.then(function (result) {
					Monitors.query().then(function (monitors) {
						if (monitors) {
							Store('monitors').save('monitors', monitors);
							
							Monitors.getWishes(options).then(function (wishes) {
								$scope.wishes = wishes;								
								timeline($scope.wishes);
								$scope.monitors = getMonitorsList();

								angular.element('#monitors #saveWish')
								.text($rootScope.ui.monitors.save_label)
								.removeAttr('disabled');								
							})
						}
					})
				})
			}

			$scope.saveUpdate = function() {			
				var groups = [], index;	
				
				angular.element('#monitors input[type=submit]')
				.val($rootScope.ui.monitors.saving_label)
				.attr('disabled', 'disabled');	

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
									$scope.monitors = getMonitorsList();
								}

								angular.element('#monitors input[type=submit]')
								.val($rootScope.ui.monitors.save_label)
								.removeAttr('disabled');
							})
								
						})
					})
				})	
			}

		}		
	]);
});