define(
  ['services/services', 'config'],
  function (services, config)
  {
    'use strict';

    services.factory('User',
        function ($resource, $q, $location, $rootScope)
        {
          var resourceObject = {
            login: {
              method: 'GET',
              params: { first: 'login', uuid: '', pass:'' }
            },
            logout: {
              method: 'GET',
              params: { first: 'logout' },
              isArray: true
            },
            resources: {
              method: 'GET',
              params: { first: 'resources' }
            },
            //environment
            domain: {
              method: 'GET',
              params: { first: 'domain' },
              isArray: true
            }
            /*geofence: {
              method: 'GET',
              params: { first: 'geofence' }
            },
            saveGeofence: {
              method: 'PUT',
              params: { first: 'geofence' }
            }*/
          };
          
          angular.forEach(resourceObject, function (value){
            if (value.method === 'GET') {
              value.interceptor = {
                response: function(response) {
                  // expose response
                  return response;
                }
              }
            }
          });

          var MyApp = $resource(config.host + '/:first/:second/:third/:fourth', {}, resourceObject);

          MyApp.prototype._ = function (proxy, params, data, callback) {
            var deferred = $q.defer();

            params = params || {};

            try{
              MyApp[proxy](
                params,
                data,
                function (result) {
                  ((callback && callback.success)) && callback.success.call(this, result);

                  //Log.print('Call:', proxy, 'params: ', params, 'data load:', data, 'result: ', result);
                  //console.log('Call:' +  proxy + 'params: ' + params + 'data load:' + data + 'result: ' + result);

                  deferred.resolve(result);
                },
                function (result) {
                  ((callback && callback.error)) && callback.error.call(this, result);

                  //Log.error('Error with call:', proxy, 'params: ', params, 'data load:', data, 'result: ', result);
                  console.log('Error with call: '+ proxy + ' params: ' + angular.toJson(params) + ' data load:' + angular.toJson(data) + ' result: ' + angular.toJson(result));

                  deferred.resolve({ error: result });
                });
            } catch (e){
              console.log("error with making call: " + e);
            }

            return deferred.promise;
          };

          return new MyApp();
        });
  });
