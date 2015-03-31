define(
    ['app'],
    function (app)
    {
        'use strict';

        app.config(
            [
                '$routeProvider', '$httpProvider',
                function ($routeProvider, $httpProvider)
                {
                    $routeProvider
                        .when('/login',
                        {
                            templateUrl:  'views/login.html',
                            controller:   'login'
                        })
                        .when('/logout',
                        {
                            templateUrl:  'views/logout.html',
                            controller:   'logout'
                        })
                        .when('/profile', 
                        {
                            templateUrl: 'views/profile.html',
                            controller:  'profile'
                        })
                        .when('/domains',
                        {
                            templateUrl:  'views/domains.html',
                            controller:   'domains'
                        })
                        .when('/domains-overview',
                        {
                            templateUrl:  'views/domains-overview.html'
                            //controller:   'domains'
                        })
                        .when('/domain-information',
                        {
                            templateUrl:  'views/domain-information.html',
                            controller:   'domainInformation'
                        })
                        .when('/logs',
                        {
                            templateUrl:  'views/logs.html'
                            //controller:   'logs'
                        })
                        .when('/monitors',
                        {
                            templateUrl:  'views/monitors.html'
                            //controller:   'monitors'
                        })
                        .when('/channels',
                        {
                            templateUrl:  'views/channels.html'
                            //controller:   'channels'
                        })
                        .when('/settings',
                        {
                            templateUrl:  'views/settings.html'
                            //controller:   'settings'
                        })
                        .otherwise({
                            redirectTo: '/login'
                        });

                    $httpProvider.interceptors.push(function ($q, Log, $location, Store) {
                      return {
                        request: function (config) {
                          return config || $q.when(config);
                        },
                        requestError: function (rejection) {
                          return $q.reject(rejection);
                        },
                        response: function (response) {
                          return response || $q.when(response);
                        },
                        responseError: function (rejection) {
                          if (rejection.status == 403) {
                            Store('environment').remove('sessionTimeout');
                            //localStorage.setItem('sessionTimeout', '');
                            $location.path('/logout');
                            //window.location.href = 'logout.html';
                          }
                          return $q.reject(rejection);
                        }
                      };
                    });
                }
            ]
        );


    }
);
