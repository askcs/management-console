if (window.location.port == '8080')
{
  document.getElementsByTagName('html')[0].setAttribute('ng-app');
}

require.config (
  {
    paths: {
      angular:  '../vendors/angular/angular',
      jquery:   '../vendors/jquery/jquery.min',
      domReady: '../vendors/requirejs-domready/domReady'
    },
    shim: {
      angular: {
        deps:     ['jquery'],
        exports:  'angular'
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
    'run',
    'config',
    'controllers/home',
    'controllers/login',
    'directives/appVersion',
    'filters/interpolate',
    'services/version',
    'services/user'
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