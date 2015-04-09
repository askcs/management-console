'use strict';

// The app/scripts/app.js file, which defines our AngularJS app
define(
  [
    'angular',
    'controllers/controllers',
    'services/services',
    'filters/filters',
    'directives/directives',
    'angular-resource',
    'angular-md5',
    'angular-route'
    
  ],
  function (angular)
  {
    return angular.module('MyApp',
      [
        'controllers',
        'services',
        'filters',
        'directives',
        'ngResource',
        'ngRoute',
        'ngMd5',
        'uiGmapgoogle-maps'
      ]);
  }
);