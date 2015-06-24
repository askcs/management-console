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

			$scope.wish = {};

			angular.element('#timelinemain').hide();		
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
				$scope.wish.id = 0;

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

			$scope.toggleWishForm = function () {										
				if ($scope.views.wish.add) {					
					$scope.resetForm();	
				}else{					
					$scope.wish = {
						start: {
							date: moment().format($rootScope.app.config.formats.date), 
							time: moment().format($rootScope.app.config.formats.time)
						},
						end: {
							date: moment().format($rootScope.app.config.formats.date),
							time: moment().add(1, 'hours').format('HH:00'),
						},
						recursive: false
					}
				
					$scope.views = {
						wish:{
							add: true,
							update: false
						}	
					}
				}					
			}								

			$scope.resetForm = function () {		
				$scope.wish = {};									
				$scope.views = {
					wish:{
						add: false,
						update: false
					}	
				}
			}	

			$scope.resetForm();

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
			  	var item = {
			  			id: wish.idx,
			  			group: occurence[1],
				  		type: occurence[3] > 0 ? 'range':'box',				  		
				  		content: occurence[3] > 0 ? '<span class="badge badge-inverse">'+ occurence[3] +'</span>' : ''
			  	}
			  	if (occurence[1] == 'weekly' || occurence[3] <= 0){
			  		angular.extend(item, {start: wish.start*1000, end:wish.end*1000})
			  	}else{
			  		angular.extend(item, {start: wish.start, end:wish.end})
			  	}			  	
			  	data.push(item);			  			
			  });			 
			  
			  //timeline options
			  var options = {					
					orientation: 'top',
					editable: {
				    add: true,         
				    updateTime: true,  
				    updateGroup: false, 
				    remove: true       
				  },
					stack: true,
					locale: 'en',
					groupOrder: function (a, b) {
			      return a.value - b.value;
			    },
			    min: current.start,
			    max: current.end,		
			    onAdd : $scope.timelineOnAdd,
			    onRemove: $scope.timelineOnRemove,
			    //onMoving: $scope.timelineOnMoving,
			    onMove: $scope.timelineOnMove	    
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

				angular.element('.menus').show();

				$scope.toolbarBtn = $rootScope.ui.monitors.add_label;			
		
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
			
			$scope.timelineOnAdd = function (item, wish) {
				var now = moment().unix();
							
				if(item){					
					$scope.$apply(						
						function () {
							$scope.views.wish.add = true;							
							$scope.views.wish.update = false;

							$scope.wish = {
								start: {
									date: moment(item.start).format($rootScope.app.config.formats.date),
									time: moment(item.start).format($rootScope.app.config.formats.time)
								},
								end: {
									date: moment(item.start).add(1, 'days').format($rootScope.app.config.formats.date),
									time: moment(item.start).add(1, 'days').format($rootScope.app.config.formats.time)
								},
								recursive: item.group == 'weekly' ? true : false
							}
						}
					);
					
					if (!$scope.wish.value) { return; }
				}

				var start = wish.start ? wish.start : $scope.wish.start;
				var end = wish.end ? wish.end : $scope.wish.end;
				var recursive = wish.recursive ? wish.recursive : $scope.wish.recursive;

				var startDatetime = moment(start.date +' '+start.time, $rootScope.app.config.formats.datetime).unix(),
						endDatetime = moment(end.date +' '+end.time, $rootScope.app.config.formats.datetime).unix();				

				if (startDatetime < now && endDatetime < now && recursive === false) {	
					$scope.alert = {
	          add: {
	            display: true,
	            type: 'alert-danger',
	            message: $rootScope.ui.wish.pastAdding
	          }
	        }										
					$timeout(function () {
						$scope.alert.add.display = false;	
					},$rootScope.app.config.timers.NOTIFICATION_DELAY);
					
					return;
				}else{
					if (startDatetime < now && recursive === false) {
						startDatetime = now;
					}
				} 

				var wish = {
					wish: wish.value,
					start: startDatetime*1000,  					
					end: endDatetime*1000,
					occurence: $scope.wish.recursive ? 'WEEKLY' : 'EVENT'
				}				
				
				if ($scope.wish.value) {
					angular.element('#monitors #add')
					.text($rootScope.ui.monitors.adding_label)
					.attr('disabled', 'disabled');				
					
					var options = {
						uuid: $scope.dmonitor.name,
						start: current.start/1000,
						end: current.end/1000
					}
					
					Monitors.setWish($scope.dmonitor.name, wish)
					.then(function (result) {
						Monitors.query().then(function () {						
							Monitors.getWishes(options).then(function (wishes) {
								$scope.wishes = wishes;								
								timeline($scope.wishes);
								$scope.monitors = getMonitorsList();

								angular.element('#monitors #add')
								.text($rootScope.ui.monitors.add_label)
								.removeAttr('disabled');								
							})						
						})
					})				
				}else {
					$scope.alert = {
            add: {
              display: true,
              type: 'alert-danger',
              message: $rootScope.ui.wish.alert_fillfiled
            }
          }
          $timeout(function () {
						$scope.alert.add.display = false;	
					},$rootScope.app.config.timers.NOTIFICATION_DELAY);

          return;
				}			
			}

			/*$scope.timelineOnMoving = function (item, callback) {				
				if (moment(item.start).unix()*1000 < $scope.timeline.options.min) item.start = $scope.timeline.options.min;
	      if (moment(item.start).unix()*1000 > $scope.timeline.options.max) item.start = $scope.timeline.options.max;
	      if (moment(item.end).unix()*1000   > $scope.timeline.options.max) item.end   = $scope.timeline.options.max;
	      callback(item);
			}*/

			$scope.timelineOnMove = function (item) {				
				$scope.$apply(function () {
					$scope.wish = {
						start: {
							date: moment(item.start).format($rootScope.app.config.formats.date),
							time: moment(item.start).format($rootScope.app.config.formats.time)
						},
						end: {
							date: moment(item.end).format($rootScope.app.config.formats.date),
							time: moment(item.end).format($rootScope.app.config.formats.time)
						},
						value: item.content.match(/<span class="badge badge-inverse">(.*)<\/span>/)[1],
						recursive : item.group === 'weekly' ? true : false,
						id: item.id
					}
				});				
			}

			$scope.timelineOnUpdate = function (item, wish) {		
				var options = {
					uuid: $scope.dmonitor.name,
					start: current.start/1000,
					end: current.end/1000
				}
				
				var now = moment().unix(),
					start = moment($scope.wish.start.date +' '+$scope.wish.start.time, $rootScope.app.config.formats.datetime).unix(),
					end =  moment($scope.wish.end.date +' '+$scope.wish.end.time, $rootScope.app.config.formats.datetime).unix();									

				if (start < now && end < now && wish.recursive === false){
					$scope.alert = {
            add: {
              display: true,
              type: 'alert-danger',
              message: $rootScope.ui.wish.pastChanging
            }
          }
          $timeout(function () {
						$scope.alert.add.display = false;	
					},$rootScope.app.config.timers.NOTIFICATION_DELAY);

          return;
				}else{
					if (start < now && wish.recursive === false) {
						start = now;
					}
				}	
				
				var wish = {
					wish: wish.value,
					start: start*1000,  					
					end: end*1000,
					occurence: wish.recursive ? 'WEEKLY': 'EVENT'
				}

				angular.element('#monitors #change')
				.text($rootScope.ui.monitors.changing_label)
				.attr('disabled', 'disabled');
			
				Monitors.setWish($scope.dmonitor.name, wish)
				.then(function (result) {
					Monitors.query().then(function () {						
						Monitors.getWishes(options).then(function (wishes) {
							$scope.wishes = wishes;								
							timeline($scope.wishes);
							$scope.monitors = getMonitorsList();

							angular.element('#monitors #change')
							.text($rootScope.ui.monitors.change_label)
							.removeAttr('disabled');								
						})						
					})
				})

			}

			$scope.timelineOnRemove = function () {				
				var options = {
					uuid: $scope.dmonitor.name,
					start: current.start/1000,
					end: current.end/1000
				},
				now = moment().unix(),
				start = moment($scope.wish.start.date +' '+$scope.wish.start.time, $rootScope.app.config.formats.datetime).unix(),
				end = moment($scope.wish.end.date +' '+$scope.wish.end.time, $rootScope.app.config.formats.datetime).unix();

				if (end <= now && $scope.wish.recursive === false) {
					$scope.alert = {
            add: {
              display: true,
              type: 'alert-danger',
              message: $rootScope.ui.wish.pastDeleting
            }
          }
          $timeout(function () {
						$scope.alert.add.display = false;	
					},$rootScope.app.config.timers.NOTIFICATION_DELAY);

					return;
				}else if (start <= now && end >= now && $scope.wish.recursive === false){					
					start = now;
				} 								
				
				var wish = {
					wish: '',
					start: start*1000,  					
					end: end*1000,
					occurence: $scope.wish.recursive ? 'WEEKLY' : 'EVENT'  
				};

				angular.element('#monitors #delete')
				.text($rootScope.ui.monitors.deleting_label)
				.attr('disabled', 'disabled');

				Monitors.setWish($scope.dmonitor.name, wish)
				.then(function () {
					Monitors.query()
					.then(function () {						
						Monitors.getWishes(options)
						.then(function (wishes) {
							$scope.wishes = wishes;
							timeline($scope.wishes);				
							$scope.monitors = getMonitorsList();

							angular.element('#monitors #delete')
							.text($rootScope.ui.monitors.delete_label)
							.removeAttr('disabled');

							$scope.resetForm();
						})
					})					
				})
			}

			var timelineOnSelect = function (id) {		
				$scope.views = {
					wish: {
						add: false,
						update: true
					}
				}							
				
				if (id.items.length === 1){							
					var item = $filter('filter')($scope.timeline.data, { id: id.items[0] }, true),						
						start, end;			

					if ($scope.wish.id !== id.items[0]) {				
						$scope.$apply(
							function () {									
								if (item[0].group == 'weekly') {
									start = $scope.timeline.options.min;			
									end = $scope.timeline.options.max;
								}else {
									start = item[0].start;
									end = item[0].end;
								}

								$scope.wish = {
									start: {
										date: moment(start).format($rootScope.app.config.formats.date),
										time: moment(start).format($rootScope.app.config.formats.time)
									},
									end: {
										date: moment(end).format($rootScope.app.config.formats.date),
										time: moment(end).format($rootScope.app.config.formats.time)
									},
									recursive: (item[0].group == 'weekly') ? true : false,
									value: item[0].content? item[0].content.match(/<span class="badge badge-inverse">(.*)<\/span>/)[1] : '',
									id: id.items[0]
								}					
							}
						)
					}
				}				
			}		

			$scope.saveUpdate = function() {			
				var groups = [], index, newGroups=[];	
				
				angular.element('#monitors input[type=submit]')
				.val($rootScope.ui.monitors.saving_label)
				.attr('disabled', 'disabled');	

				_.each($scope.groups.selectedGroup, function (group) {
					newGroups.push(group.uuid);

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
									$scope.monitors = getMonitorsList();
									$scope.dmonitor.monitoringGroups = newGroups;									
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