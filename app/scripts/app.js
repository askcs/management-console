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
    'angular-route',
    'angular-ui-select',
    'angular-sanitize',
    'angular-daterangepicker',
    'angular-strap'
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
        'uiGmapgoogle-maps',
        'ui.select',
        'ngSanitize',
        'daterangepicker',
        'mgcrea.ngStrap'
        //'ngVis'
      ]);
  }
);