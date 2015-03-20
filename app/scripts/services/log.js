define(['services/services'], function (services) {
  'use strict';

  services.factory('Log', ['Store', function (Store) {
    return {
      record: function (key, message) {
        var stamp = Date.now();
        key += '_' + stamp;

        return Store('logs').save(key, {
          time: stamp,
          message: message
        });
      },
      error: function (trace) {
        var body,
          err,
          stamp;

        stamp = Date.now();
        err = {};
        body = {};

        if (trace.hasOwnProperty('message')) {
          body = {
            stack: trace.stack,
            message: trace.message
          };
        } else {
          body = {
            trace: trace
          };
        }

        err[stamp] = body;

        return Store('error').save('error_' + stamp, err);
      }
    };
  }]);
});