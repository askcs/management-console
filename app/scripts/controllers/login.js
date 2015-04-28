define(['controllers/controllers'], function (controllers){
    'use strict';

    controllers.controller ('login',
      [
        '$scope', '$rootScope', '$q', '$location', '$timeout', 'Session', 'Storage', 'Store', '$routeParams', 'UserCall', 'md5', 'Environment', 'Monitors',
        function($scope, $rootScope, $q, $location, $timeout, Session, Storage, Store, $routeParams, UserCall, md5, Environment, Monitors){
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
            Store('domain').nuke();
         
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
          
              }else{
               configure();
              }
            });
          }

          function preloader(){
            progress(20);

            UserCall.resources().then(function (resources){
              Environment.setup().then(function (setup){
              
                progress(50);
              
                Monitors.get().then(function (result) {
                  if (result) {                    
                    Store('domain').save('monitors', result);

                    progress(80);
                  }

                  finalize();
                });

              });
              
            });
          }

          function configure(){           
            $('#login').hide();
            $('#preloader').show();

            progress();

            preloader();
          }

          function finalize(){
            progress(100);

            angular.element('.navbar').show();
            angular.element('.topbar').show();

            $location.path('/domains');
          }
          
          function progress(value){
            $scope.width_progress = { "width": value + "%" };
          }

        }
      ]
    );
  }
);
