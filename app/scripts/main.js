if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

require.config (
  {
    paths: {
      config: 'config',
      angular:  '../vendors/angular/angular',
      jquery:   '../vendors/jquery/jquery.min',
      domReady: '../vendors/requirejs-domready/domReady',
      'angular-md5': '../vendors/angular-md5/angular-md5.min',
      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route': '../vendors/angular-route/angular-route.min',
      lawnchair: '../vendors/lawnchair/src/Lawnchair',
      dom: '../vendors/lawnchair/src/adapters/dom',
      underscore: '../vendors/underscore/underscore',
      'angular-google-maps': '../vendors/angular-google-maps/dist/angular-google-maps.min',
      'lodash': '../vendors/lodash/dist/lodash.min',
      d3:                 '../vendors/d3/d3.min'
    },
    shim: {
      angular: {
        deps:     ['jquery', 'config'],
        exports:  'angular'
      },
      'angular-resource': { deps: ['angular'] },
      'angular-md5': { deps: ['angular'] },
      'angular-route': { deps: ['angular'] },
      lawnchair: { deps: [], exports: 'lawnchair' },
      dom: { deps: ['lawnchair'], exports: 'dom' },
      underscore: { exports: 'underscore'},
      'angular-google-maps': { deps: ['angular'] },
      lodash: { deps: [], exports: 'lodash' },
      d3: { exports:'d3' }
    }
  }
);

require (
  [
    'angular',
    'app',
    'domReady',
    'routes',
    'angular-resource',
    'angular-md5',
    'run',
    'locals',
    'config',
    'controllers/home',
    'controllers/login',
    'controllers/logout',
    'controllers/domains',
    'controllers/profile',
    'controllers/domain-information',
    'controllers/monitors',
    'directives/appVersion',
    'filters/interpolate',
    'services/version',
    'services/user',
    'services/log',
    'services/storage',
    'services/session',
    'services/store',
    'modals/user',
    'modals/profile',
    'modals/monitors',
    'modals/environment',
    'lawnchair',
    'dom',
    'underscore',
    'angular-google-maps',
    'lodash',
    'd3'
    // Any individual controller, service, directive or filter file
    // that you add will need to be pulled in here.
  ],
  function (angular, app, domReady)
  {
    'use strict';

    domReady(function ()
      {
        angular.bootstrap(document, ['MyApp']);
      }
    );

  }
);
