define(
  ['controllers/controllers', 'services/user'],
  function (controllers)
  {
    'use strict';

    controllers.controller ('login',
      [
        '$scope', 'User',
        function ($scope, User)
        {
          //$scope.name = User.get();
        }
      ]
    );
  }
);