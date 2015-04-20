define(
  ['app', 'config', 'locals'],
  function (app, config, locals)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$location', 'Session', 'Store', '$templateCache',
        function($rootScope, $location, Session, Store, $templateCache)
        {
          $rootScope.$on('$routeChangeStart', function (event, next, current)
          {
            // Remove this lines on production, eye-candy purple background for the home/splash page
            //($location.path() == '/home') ? $('body').addClass('bs-docs-home') : $('body').removeClass('bs-docs-home');
          });

          $rootScope.$on('$routeChangeSuccess', function (event, current, previous)
          {
          });

          $rootScope.$on('$routeChangeError', function (event, current, previous, rejection)
          {
            console.error('Error: changing routes!');
          });

          //add new definition for session
          $rootScope.app = $rootScope.app ||
          {
            config: config,
            session: {},
            resources: {},
            environment: {
              domain: '',
              geofence: {}
            },
            settings: {},
            logindata: {},
            domain: {
              monitors: {}
            }
          };

          //session
          if (!_.isUndefined($rootScope.app.session) && Session.check()) {
            $rootScope.app.session = angular.fromJson(sessionStorage.getItem('session'));
          }

          //user (profile)
          if (!_.isUndefined($rootScope.app.resources) && Store('user').get('resources') !== null) {
            $rootScope.app.resources = Store('user').get('resources');
          }
          
          var settings = Store('settings').get('mine');
          if (settings) {
            $rootScope.app.settings = settings;
          }else {
            $rootScope.app.settings = {
              language: config.lang
            };

            Store('settings').save('mine', $rootScope.app.settings);
          }

          //login data (Username, md5, remember state)
          $rootScope.app.logindata = Store('environment').get('logindata');
          
          //change language
          $rootScope.changeLanguage = function (lang) {
            $rootScope.ui = locals.ui[lang];
            $rootScope.app.settings.language = lang;
          };

          if ($rootScope.app.resources && $rootScope.app.resources.settingsMC) {
            $rootScope.changeLanguage(angular.fromJson($rootScope.app.resources.settingsMC).user.language);
          }else {
            $rootScope.changeLanguage($rootScope.app.config.lang);
          }

          //template for google map search box
          $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search">');
          $templateCache.put('window.tpl.html', '<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">{{place.name}}</div>');
          
        }
      ]
    );
  }
);
