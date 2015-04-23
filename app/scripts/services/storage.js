define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('Storage', ["$rootScope", function ($rootScope) {
    if (config.title.substr(-1) !== '.') {
      config.title = !!config.title ?
        config.title + '.' :
        '';
    }

    var browserSupportsLocalStorage = function () {
      try {
        return ('localStorage' in window && window['localStorage'] !== null);
      } catch (e) {
        return false;
      }
    };

    var addToLocalStorage = function (key, value) {
      if (!browserSupportsLocalStorage()) return false;

      if (!value && value !== 0 && value !== "") return false;

      try {
        localStorage.setItem(config.title + key, value);
      } catch (e) {
        return false;
      }

      return true;
    };

    var getFromLocalStorage = function (key) {
      if (!browserSupportsLocalStorage()) return false;

      var item = localStorage.getItem(config.title + key);

      if (!item) return null;

      return item;
    };

    var removeFromLocalStorage = function (key) {
      if (!browserSupportsLocalStorage()) return false;

      try {
        localStorage.removeItem(config.title + key);
      } catch (e) {
        return false;
      }

      return true;
    };

    var clearAllFromLocalStorage = function () {
      if (!browserSupportsLocalStorage()) return false;

      var prefixLength = config.title.length;

      for (var key in localStorage) {
        if (key.substr(0, prefixLength) === config.title) {
          try {
            removeFromLocalStorage(key.substr(prefixLength));
          } catch (e) {
            return false;
          }
        }
      }

      return true;
    };

    var browserSupportsSessionStorage = function () {
      try {
        return ('sessionStorage' in window && window['sessionStorage'] !== null);
      } catch (e) {
        return false;
      }
    };

    var addToSessionStorage = function (key, value) {
      if (!browserSupportsSessionStorage()) return false;

      if (!value && value !== 0 && value !== "") return false;

      try {
        sessionStorage.setItem(config.title + key, value);
      } catch (e) {
        return false;
      }

      return true;
    };

    var getFromSessionStorage = function (key) {
      if (!browserSupportsSessionStorage()) return false;

      var item = sessionStorage.getItem(config.title + key);

      if (!item) return null;

      return item;
    };

    var removeFromSessionStorage = function (key) {
      if (!browserSupportsSessionStorage()) return false;

      try {
        sessionStorage.removeItem(config.title + key);
      } catch (e) {
        return false;
      }

      return true;
    };

    var clearAllFromSessionStorage = function () {
      if (!browserSupportsSessionStorage()) return false;

      var prefixLength = config.title.length;

      for (var key in sessionStorage) {
        if (key.substr(0, prefixLength) === config.title) {
          try {
            removeFromSessionStorage(key.substr(prefixLength));
          } catch (e) {
            return false;
          }
        }
      }

      return true;
    };

    var browserSupportsCookies = function () {
      try {
        return navigator.cookieEnabled ||
          ("cookie" in document && (document.cookie.length > 0 ||
            (document.cookie = "test").indexOf.call(document.cookie, "test") > -1));
      } catch (e) {
        return false;
      }
    };

    var addToCookies = function (key, value) {
      if (typeof value == "undefined") return false;

      if (!browserSupportsCookies())  return false;

      try {
        var expiry = '',
          expiryDate = new Date();

        if (value === null) {
          config.cookie.expiry = -1;

          value = '';
        }

        if (config.cookie.expiry !== 0) {
          expiryDate.setTime(expiryDate.getTime() + (config.cookie.expiry * 60 * 60 * 1000));

          expiry = "; expires=" + expiryDate.toGMTString();
        }

        document.cookie = config.title +
          key +
          "=" +
          //encodeURIComponent(value) +
          value +
          expiry +
          "; path=" +
          config.cookie.path;
      } catch (e) {
        return false;
      }

      return true;
    };

    var getFromCookies = function (key) {
      if (!browserSupportsCookies()) {
        $rootScope.$broadcast('StorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
        return false;
      }

      var cookies = document.cookie.split(';');

      for (var i = 0; i < cookies.length; i++) {
        var thisCookie = cookies[i];

        while (thisCookie.charAt(0) == ' ')
          thisCookie = thisCookie.substring(1, thisCookie.length);

        if (thisCookie.indexOf(config.title + key + '=') == 0) {
          return decodeURIComponent(thisCookie.substring(config.title.length + key.length + 1, thisCookie.length));
        }
      }

      return null;
    };

    var removeFromCookies = function (key) {
      addToCookies(key, null);
    };

    var clearAllFromCookies = function () {
      var thisCookie = null,
        thisKey = null,
        prefixLength = config.title.length,
        cookies = document.cookie.split(';');

      for (var i = 0; i < cookies.length; i++) {
        thisCookie = cookies[i];

        while (thisCookie.charAt(0) == ' ')
          thisCookie = thisCookie.substring(1, thisCookie.length);

        key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));

        removeFromCookies(key);
      }
    };

    var storageSize = function (key) {
      var item = (key) ? localStorage.key : localStorage;

      return ((3 + ((item.length * 16) / (8 * 1024))) * 0.0009765625).toPrecision(2) + ' MB';
    };

    var getPeriods = function () {
      return angular.fromJson(getFromLocalStorage('periods'));
    };

    var getGroups = function () {
      return angular.fromJson(getFromLocalStorage('groups'));
    };

    var getMembers = function () {
      return angular.fromJson(getFromLocalStorage('members'));
    };

    var getSettings = function () {
      var settings = angular.fromJson(getFromLocalStorage('resources'));

      return (!settings.settingsWebPaige) ?
        $rootScope.StandBy.config.defaults.settingsWebPaige :
        angular.fromJson(settings.settingsWebPaige);
    };

    return {
      isSupported: browserSupportsLocalStorage,
      add: addToLocalStorage,
      get: getFromLocalStorage,
      remove: removeFromLocalStorage,
      clearAll: clearAllFromLocalStorage,
      session: {
        add: addToSessionStorage,
        get: getFromSessionStorage,
        remove: removeFromSessionStorage,
        clearAll: clearAllFromSessionStorage
      },
      cookie: {
        add: addToCookies,
        get: getFromCookies,
        remove: removeFromCookies,
        clearAll: clearAllFromCookies
      },
      size: storageSize,
      local: {
        periods: getPeriods,
        groups: getGroups,
        members: getMembers,
        settings: getSettings
      }
    }
  }]);
});