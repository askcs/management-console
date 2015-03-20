define(['services/services'], function (services) {
  'use strict';

  services.factory('Session', ['$rootScope', '$http', function ($rootScope, $http) {
    return {
      check: function () {
        return ((this.get()));
      },

      get: function () {
        var session = angular.fromJson(sessionStorage.getItem("session"));

        if (!$http.defaults.headers.common["X-SESSION_ID"] && session)
          $http.defaults.headers.common["X-SESSION_ID"] = session.id;

        return (session) ? session.id : false;
      },

      set: function (id) {
        $http.defaults.headers.common["X-SESSION_ID"] = id;

        var session = {
          id: id,
          time: new Date()
        };

        sessionStorage.setItem('session', angular.toJson(session));
       
        $rootScope.app.session = session;
      },

      clear: function () {
        sessionStorage.removeItem("session");

        delete $rootScope.app.session;

        $http.defaults.headers.common["X-SESSION_ID"] = null;
      }
    };
  }]);

  // Tweaked
//  services.factory('Session2', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
//    return {
//      check: function () {
//        if (!this.get()) {
//          $location.path('/login');
//          return false;
//        }
//
//        return true;
//      },
//      get: function () {
//        var session = angular.fromJson(sessionStorage.getItem('session'));
//
//        if (!$http.defaults.headers.common['X-SESSION_ID'] && session) {
//          $http.defaults.headers.common['X-SESSION_ID'] = session.id;
//        }
//
//        return (session) ? session.id : false;
//      },
//      set: function (id) {
//        $http.defaults.headers.common['X-SESSION_ID'] = id;
//
//        sessionStorage.setItem('session', angular.toJson({
//          id: id,
//          time: new Date()
//        }));
//      },
//      clear: function () {
//        sessionStorage.removeItem('session');
//
//        $http.defaults.headers.common['X-SESSION_ID'] = null;
//      }
//    };
//  }]);

  // Legacy
//  services.factory('Session__', ['$rootScope', '$http', 'Storage', function ($rootScope, $http, Storage) {
//    return {
//      check: function () {
//        var session = angular.fromJson(Storage.cookie.get('session'));
//
//        if (session) {
//          this.set(session.id);
//
//          return true;
//        }
//        else {
//          return false;
//        }
//      },
//
//      cookie: function (session) {
//        var values,
//          pairs = document.cookie.split(';');
//
//        for (var i = 0; i < pairs.length; i++) {
//          values = pairs[i].split('=');
//
//          if (values[0].trim() == 'WebPaige.session') return angular.fromJson(values[1]);
//        }
//
//      },
//
//      get: function (session) {
//        this.check(session);
//
//        this.set(session.id);
//
//        return session.id;
//      },
//
//      set: function (sessionId) {
//        var session = {
//          id: sessionId,
//          time: new Date()
//        };
//
//        Storage.cookie.add('session', angular.toJson(session));
//
//        $rootScope.session = session;
//
//        $http.defaults.headers.common['X-SESSION_ID'] = $rootScope.session.id;
//
//        // $.ajaxSetup({cache: false});
//        // $http.defaults.cache = false;
//
//        return session;
//      },
//
//      clear: function () {
//        $rootScope.session = null;
//
//        $http.defaults.headers.common['X-SESSION_ID'] = null;
//      }
//    }
//  }]);
});
