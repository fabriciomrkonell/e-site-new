require.config({
  baseUrl: "/",
  paths: {
    'jquery': 'lib/jquery/dist/jquery.min',
    'jqueryForm': 'lib/jquery/dist/jquery-form',
    'bootstrap': 'lib/bootstrap-css/js/bootstrap.min',
    'angular': 'lib/angular/angular.min',
    'angular-route': 'lib/angular-route/angular-route.min',
    'angularAMD': 'lib/angular-amd/angularAMD.min',
    'angular-sanitize': 'lib/angular-sanitize/angular-sanitize',
    'autocomplete': 'lib/autocomplete/js/angucomplete'
  },
  shim: {
    'angularAMD': ['angular'],
    'angular-route': ['angular'],
    'angular-sanitize': ['angular'],
    'bootstrap': ['jquery'],
    'jqueryForm': ['jquery'],
    'autocomplete': ['angular'],
  },
  deps: ['js/app', 'angular-sanitize', 'bootstrap', 'jqueryForm']
});