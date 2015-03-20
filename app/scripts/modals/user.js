define(['services/services', 'config'], function (services, config) {
  'use strict';

  services.factory('UserCall', function ($rootScope, $location, $resource, $q, $http, Log, md5, Session, Store, User) {
    var UserCall = $resource();

    UserCall.prototype.login = function(username, password){

      var deferred = $q.defer();

      try{
        User._('login', {uuid: username.toLowerCase(), pass:md5.createHash(password) }).then(function (result){

          if (!result.error){
            Session.set(result['X-SESSION_ID']);
            //alert(result['X-SESSION_ID']);
          }
          deferred.resolve(result);
        });
      } catch(e){
        Log.error('Something went wrong with login call: ', e);
      }

      return deferred.promise;
    };

    UserCall.prototype.logout = function () {
      var deferred = $q.defer();

      try {
        User._('logout').then(function (result) {
          Session.clear();

          deferred.resolve(result);
        });
      } catch (e) {
        Log.error('Something went wrong with logout call: ', e);
      }

      return deferred.promise;
    };

    return new UserCall();
  });

});