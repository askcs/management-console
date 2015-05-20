define(['directives/directives', 'vis', 'moment'], function (directives, vis, moment) {
	'use strict';

	directives.directive('timeLine', function () {
		return {
			restrict: 'E',
			scope: {
				data: '=data',
				options: '=options',
				groups: '=groups',
				event: '@event',
				callback: '&'
			},
			link: function (scope, element, attr) {
				var timeline = null;

				var createTimeline = function(scope) {					
					var dataSet = new vis.DataSet(scope.data);
					var groupsSet = new vis.DataSet(scope.groups);

					console.log(dataSet);

					timeline = new vis.Timeline(element[0], dataSet, scope.options);		
					timeline.setGroups(groupsSet);				

					return timeline.on(scope.event, function (properties) {
						if (properties.length !== 0) {
							scope.callback({params: properties});
						}
					});
				};

				scope.$watch('data', function(newVal, oldVal) {					
					if (timeline) {
						timeline.destroy();
					}
					createTimeline(scope);
				}, true);
				
			}			
		}
	})
})