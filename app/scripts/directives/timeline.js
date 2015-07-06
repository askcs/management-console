define(['directives/directives', 'vis', 'moment'], function (directives, vis, moment) {
	'use strict';

	directives.directive('timeLine', function () {
		return {
			restrict: 'E',
			scope: {
				data: '=data',
				options: '=options',
				groups: '=groups',
				events: '=events'
			},
			link: function (scope, element, attr) {
				var timeline = null;
				var timelineEvents = [
					'select'
				]				

				scope.$watch('data', function() {					
					if (timeline) {
						timeline.destroy();
					}

					var dataSet = new vis.DataSet();
					var groupsSet = new vis.DataSet(scope.groups);
				
					timeline = new vis.Timeline(element[0], dataSet, scope.options);		
					timeline.setGroups(groupsSet);

					dataSet.clear();
					if (scope.data){
						dataSet.update(scope.data);
					}
						
					_.each(scope.events, function(callback, event) {
						if (timelineEvents.indexOf(String(event)) >= 0) {
							timeline.on(event, callback);
						}
					});

					if (scope.events != null && scope.events.onload != null && angular.isFunction(scope.events.onload)) {
						scope.events.onload(timeline);
						
					}
				}, true);

				scope.$watchCollection('options', function (options) {
					if (timeline == null) {
						return;
					}					
					
					timeline.setOptions(options);
					try {
						timeline.setWindow({
	            start: options.min, 
	            end: options.max,
	            animation: false
	        	});						
					} catch (e) {
						console.warn('error : ', e)	
					}
					
				});				
				
			}

		}
	})
})