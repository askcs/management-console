define(['services/services', 'moment'], function (services, moment) {
	'use strict';

	services.factory('moment', function () {
		return moment;
	});

});