module.exports = function (karma)
{
  'use strict';

  karma.set({
    frameworks: ['jasmine', 'requirejs'],
    files: [
      {pattern: 'app/vendors/jquery/jquery.min.js', included: false },
      {pattern: 'app/vendors/angular/angular.min.js', included: false },
      {pattern: 'app/vendors/angular-mocks/angular-mocks.js', included: false },
      {pattern: 'app/vendors/angular-resource/angular-resource.min.js', included: false },
      {pattern: 'app/vendors/angular-route/angular-route.min.js', included: false },
      {pattern: 'app/vendors/angular-md5/angular-md5.min.js', included: false },
      {pattern: 'app/vendors/lawnchair/src/Lawnchair.js', included: false },
      {pattern: 'app/vendors/lawnchair/src/adapters/dom.js', included: false },
      {pattern: 'app/vendors/underscore/underscore.js', included: false },
      {pattern: 'app/scripts/*.js',           included: false},
      {pattern: 'app/scripts/**/*.js',        included: false},
      {pattern: 'test/spec/controllers/*.js', included: false},
      //{pattern: 'app/vendors/**/*.js',        included: false},
      //{pattern: 'test/spec/directives/*.js',  included: false},
      //{pattern: 'test/spec/filters/*.js',     included: false},
      //{pattern: 'test/spec/services/*.js',    included: false},
      'test/spec/test-unit-main.js'
      //'test/spec/test-main.js'
    ],
    basePath: '',
    exclude: [
      'app/scripts/main.js'
    ],
    reporters: ['progress'],
    port: 8080,
    runnerPort: 9100,
    colors: true,
    logLevel: karma.LOG_DEBUG,
    autoWatch: true,
    browsers: ['PhantomJS'],
    captureTimeout: 10000,
    singleRun: false,
    
  });
};