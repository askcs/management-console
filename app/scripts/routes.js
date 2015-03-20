define(
    ['app'],
    function (app)
    {
        'use strict';

        app.config(
            [
                '$routeProvider',
                function ($routeProvider)
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
                            templateUrl:  'views/domain-information.html'
                            //controller:   'domain-information'
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
                }
            ]
        );


    }
);
