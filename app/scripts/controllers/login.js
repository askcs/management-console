define(['controllers/controllers'], function (controllers){
    'use strict';

    controllers.controller ('login',
      [
        '$scope', '$rootScope', '$q', '$location', '$timeout', 'Session', 'Storage', 'Store', '$routeParams', 'UserCall', 'md5',
        function($scope, $rootScope, $q, $location, $timeout, Session, Storage, Store, $routeParams, UserCall, md5){
          $scope.login = {};
          
          $scope.alert = {
              login: {
                display: false,
                message: ''
              }
          };
          
          angular.element('.navbar').hide();
          angular.element('.topbar').hide();
          
          var logindata = Store('environment').get('logindata');
          if (logindata && logindata.remember) $scope.logindata = logindata;

          $scope.auth = function(){
            Store('user').nuke();
            Store('environment').nuke();

            Storage.clearAll();
            Storage.session.clearAll();

            if (!$scope.logindata || !$scope.logindata.username || !$scope.logindata.password){
              $scope.alert = {
                login: {
                  display: true,
                  message: $rootScope.ui.login.alert_fillfiled
                }
              }
              return false;
            }

            Store('environment').save('logindata', {
              username: $scope.logindata.username,
              password: $scope.logindata.password,
              remember: $scope.logindata.remember
            });

            Store('environment').save('askPass', md5.createHash($scope.logindata.password));

            authenticate($scope.logindata.username, $scope.logindata.password);
          };

          /*if ($location.search().email && $location.search().password){
            authenticate($location.search().email, $location.search().password);
          }*/

          function authenticate(uuid, pass){

            UserCall.login(uuid, pass).then(function (result){
              if (result.error && result.error.status){
                $scope.alert = {
                  login:{
                    display:true,
                    message:(result.error.status == 400 ||
                      result.error.status == 403 ||
                      result.error.status == 404) ?
                      'Wrong username or password!' : 'There has been an error with your login!'
                  }
                }
                return false;
                //alert (result.error.status);
              }else{
               //alert('successfully logged in ' + Session.get());
               configure();
              }
            });
          }

          function preloader(){
            UserCall.resources().then(function (resources){
              if (resources.error){
                console.warn('error : ' + resources);
              }
            });
          }

          function configure(){
            var defaults = $rootScope.app.config.defaults.settingsMC;
            
            preloader();

            finalize();
          }

          function finalize(){
            $location.path('/domains');
          }
          
        }
      ]
    );
  }
);
