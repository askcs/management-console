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

				scope.$watchCollection('options', function (options) {
					if (timeline == null) {
						return;
					}
					timeline.setOptions(options);
				});				

				//navigation menus
				document.getElementById('moveRight').onclick = function () { move(-1); }
				document.getElementById('moveLeft').onclick = function () { move(1); }				
							
				function move (percentage) {
		      var range = timeline.getWindow();
		      var interval = range.end - range.start;
		      
					if (interval <= 60*60*24*7*1000)  {
						interval = 60*60*24*7*1000;
					}
					
					var newStart = moment(range.start.valueOf() - interval * percentage).startOf('isoWeek').unix()*1000;
					var newEnd = moment(range.start.valueOf() - interval * percentage).endOf('isoWeek').unix()*1000;

					scope.options.min = newStart;
					scope.options.max = newEnd;

		      timeline.setWindow({
            start: newStart, 
            end: newEnd 
        	});		      

		      timeline.setOptions({
		       	min: newStart,
		       	max: newEnd
		      });
		    }

			}

		}
	})
})