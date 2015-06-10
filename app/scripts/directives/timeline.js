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

					var dataSet = new vis.DataSet(scope.data);
					var groupsSet = new vis.DataSet(scope.groups);

					console.log(dataSet);

					timeline = new vis.Timeline(element[0], dataSet, scope.options);		
					timeline.setGroups(groupsSet);

					_.each(scope.events, function(callback, event) {
						if (timelineEvents.indexOf(String(event)) >= 0) {
							timeline.on(event, callback);
						}
					});

					if (scope.events != null && scope.events.onload != null && angular.isFunction(scope.events.onload)) {
						scope.events.onload(timeline);
						
					}
				}, true);				
			}

		}
	})
})