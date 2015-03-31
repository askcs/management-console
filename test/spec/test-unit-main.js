var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    // Removed "Spec" naming from files
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
      console.log(file);
    }
  }
}

requirejs.config(
  {
    baseUrl: '/base/app/scripts',

    paths: {
      //config: 'config',
      angular:      '../vendors/angular/angular.min',
      'angular-resource': '../vendors/angular-resource/angular-resource.min',
      jquery:       '../vendors/jquery/jquery.min',
      domReady:     '../vendors/requirejs-domready/domReady',
      'angular-route': '../vendors/angular-route/angular-route.min',
      'angular-md5': '../vendors/angular-md5/angular-md5.min',
      'angular-mocks': '../vendors/angular-mocks/angular-mocks',
      lawnchair: '../vendors/lawnchair/src/Lawnchair',
      'lawnchair-dom': '../vendors/lawnchair/src/adapters/dom',
      underscore: '../vendors/underscore/underscore',
      //plugins: 'plugins',

      //unitTest:     '../../test/spec'
    },

    shim: {
      'angular-resource': { deps: ['angular'] },
      'angular-route': { deps: ['angular'] },
      'angular-md5': { deps: ['angular'] },
      angular: {
        deps:    ['jquery'],
        exports: 'angular'
      },
      'angular-mocks': {
        deps: ['angular'],
        exports: 'angular.mock'
      },
      lawnchair: { deps: [], exports: 'lawnchair' },
      'lawnchair-dom': { deps: ['lawnchair'], exports: 'dom' },
      underscore: { exports: 'underscore'}
    },

    deps: tests,
   
    callback: window.__karma__.start
  }
);
