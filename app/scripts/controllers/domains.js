define(['controllers/controllers'], function (controllers){
	'use strict';

	controllers.controller('domains', ['$scope', '$rootScope', '$location', 'Session', 'Store', 'Monitors',
		function($scope, $rootScope, $location, Session, Store, Monitors){			

			var monitors = Store('monitors').get('monitors');
     	var lmonitor = [];
     	var domain = Store('environment').get('domain');

     	function getColor (isRunning){
        switch (isRunning){
            case 'OFF' : return '#8f8f8f';
            break;

            case 'UNKNOWN': return '#C2771B';
            break;

            case 'MONITOR' : return '#397D39';
            break;

            case 'ESCALATE' : return '#D34545';
            break;

            default: 
              return '#8f8f8f';
          }
      }

      function getIcon(mobileMedium) {
        switch (mobileMedium) {
          case 'PHONE': return '\uf095';
          break;

          case 'APP': return '\uf075';
          break;

          case 'EMAIL': return '\uf01c';
          break;

          case 'SMS': return '\uf0e0'; 
        }
      }

      angular.forEach(monitors.data, function(monitor) {
      if (monitor.length > 1) {        
        angular.forEach(monitor, function (ch) {
          var color = getColor(ch.isRunning);        
          var icon = getIcon(ch.mobileMedium);

          lmonitor.push({
            name: ch.name + '\n' + ch.groupName,
            wish: ch.wish,
            value: color,
            icon: icon
          });
        })
      }else{       
        var color = getColor(monitor[0].isRunning);
        var icon = getIcon(monitor[0].mobileMedium);

        lmonitor.push({
          name: monitor[0].name + '\n' +  monitor[0].groupName,
          wish: monitor[0].wish,
          value: color,     
          icon: icon
        });
      }
    });

    //define content for the tree
    var content = {
      name : domain.toUpperCase(),
      children: lmonitor
    }

    $scope.data = content;     
			
		}
	]);
});