if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

require.config (
  {
    paths: {
      config: 'config',
      angular:  '../vendors/angular/angular',
      jquery:   '../vendors/jquery/dist/jquery.min',
      domReady: '../vendors/requirejs-domready/domReady',
      bootstrap: '../vendors/bootstrap/dist/js/bootstrap',
      'angular-md5': '../vendors/angular-md5/angular-md5.min',
      'angular-strap':    '../vendors/angular-strap/dist/angular-strap.min',
      'angular-strap-tpl':    '../vendors/angular-strap/dist/angular-strap.tpl.min',
      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      'angular-route': '../vendors/angular-route/angular-route.min',
      lawnchair: '../vendors/lawnchair/src/Lawnchair',
      dom: '../vendors/lawnchair/src/adapters/dom',
      underscore: '../vendors/underscore/underscore',
      'angular-google-maps': '../vendors/angular-google-maps/dist/angular-google-maps.min',
      'lodash': '../vendors/lodash/dist/lodash.min',
      d3:                 '../vendors/d3/d3.min',
      'angular-ui-select': '../vendors/angular-ui-select/dist/select.min',
      'angular-sanitize': '../vendors/angular-sanitize/angular-sanitize.min',
      vis: '../vendors/vis/dist/vis.min',
      moment: '../vendors/moment/moment',
      daterangepicker: '../vendors/bootstrap-daterangepicker/daterangepicker',
      'angular-daterangepicker': '../vendors/angular-daterangepicker/js/angular-daterangepicker.min'
      //'angular-visjs' : '../vendors/angular-visjs/angular-vis'
    },
    shim: {
      angular: {
        deps:     ['jquery', 'config'],
        exports:  'angular'
      },
      'angular-resource': { deps: ['angular'] },
      'angular-md5': { deps: ['angular'] },
      'angular-route': { deps: ['angular'] },
      bootstrap: { deps: ['jquery'], exports: 'bootstrap' },
      'angular-strap': { deps: ['angular'] },
      'angular-strap-tpl': { deps: ['angular','angular-strap'] },
      lawnchair: { deps: [], exports: 'lawnchair' },
      dom: { deps: ['lawnchair'], exports: 'dom' },
      underscore: { exports: 'underscore'},
      'angular-google-maps': { deps: ['angular'] },
      lodash: { deps: [], exports: 'lodash' },
      d3: { exports:'d3' },
      'angular-ui-select': { deps: ['angular'] },
      'angular-sanitize': { deps: ['angular'] },
      vis: { exports: 'vis' },
      daterangepicker: { deps: ['jquery', 'moment'], exports: 'daterangepicker' },
      'angular-daterangepicker': { deps: ['angular', 'daterangepicker', 'moment', 'bootstrap'] }
      //'angular-visjs': { deps: ['vis', 'angular'], exports: 'angular-visjs' }
    },
    config: {
      moment: {
        noGlobal: true
      }
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
    'angular-strap',
    'angular-strap-tpl',
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
    'directives/timeline',
    'filters/interpolate',
    'services/version',
    'services/user',
    'services/log',
    'services/storage',
    'services/session',
    'services/store',
    'services/moment',
    'modals/user',
    'modals/profile',
    'modals/monitors',
    'modals/environment',
    'modals/groups',
    'lawnchair',
    'dom',
    'underscore',
    'angular-google-maps',
    'lodash',
    'd3'
    //'angular-visjs'
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
