define(
  ['controllers/controllers', 'config'],
  function (controllers, config) {
    'use strict';

    controllers.controller(
      'logout', 
      [
        '$rootScope', '$scope', '$window', 'Session', 'UserCall', 'Store', '$location', 
    	  function($rootScope, $scope, $window, Session, UserCall, Store, $location){
    		  
          var logindata = Store('environment').get('logindata');

          UserCall.logout()
            .then(
            function (result) {
    			    if (result.error) {
    				    console.warn('error -> ', result);
    			   }
    			   else {
              Store('environment').nuke();
              
              Store('environment').save('logindata', logindata);
              
    				  $window.location.href = '#/login';
    			 }
    		})
      }]
    );
  }
);
