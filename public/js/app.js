'use strict';

define(['angularAMD', 'angular-route', 'angular-sanitize', 'autocomplete'], function(angularAMD) {

  var app = angular.module("app", ['ngRoute', 'ngSanitize', 'angucomplete']);

  app.config(function($routeProvider, $locationProvider, $httpProvider, $provide) {

    $provide.factory('$routeProvider', function() {
      return $routeProvider;
    });

    $routeProvider.when('/home', angularAMD.route({
      templateUrl: '/view/home',
    })).when('/searchuserview', angularAMD.route({
      templateUrl: '/view/searchuserview',
      controller: 'searchuserview',
      controllerUrl: '/js/searchuserview',
    })).when('/persistuserpassword', angularAMD.route({
      templateUrl: '/view/persistuserpassword',
      controller: 'persistuserpassword',
      controllerUrl: '/js/persistuserpassword',
    })).when('/persiststorepicture/:id', angularAMD.route({
      templateUrl: '/view/persiststorepicture',
      controller: 'persiststorepicture',
      controllerUrl: '/js/persiststorepicture',
    })).when('/persistproductpicture/:id', angularAMD.route({
      templateUrl: '/view/persistproductpicture',
      controller: 'persistproductpicture',
      controllerUrl: '/js/persistproductpicture',
    })).when('/persistsaleexcel/:id', angularAMD.route({
      templateUrl: '/view/persistsaleexcel',
      controller: 'persistsaleexcel',
      controllerUrl: '/js/persistsaleexcel',
    })).when('/persistsaleproduct/:id', angularAMD.route({
      templateUrl: '/view/persistsaleproduct',
      controller: 'persistsaleproduct',
      controllerUrl: '/js/persistsaleproduct',
    })).when('/searchfeature/:id', angularAMD.route({
      templateUrl: '/view/searchfeature',
      controller: 'searchfeature',
      controllerUrl: '/js/searchfeature',
    })).when('/searchuserpassword', angularAMD.route({
      templateUrl: '/view/searchuserpassword',
      controller: 'searchuserpassword',
      controllerUrl: '/js/searchuserpassword',
    })).otherwise({ redirectTo: "/home" });

    var interceptor = function($window){
      function success(response){
        if(response.data.success == 2){
          return error(response);
        }
        if(response.data.success == 0){
          return error(response);
        }
        return response;
      };
      function error(response) {
        if(response.data.success == 2){
          window.location = '/admin';
        }
        if(response.data.success == 0){
          alert(response.data.message);
        }
      };
      return function(promise) {
        return promise.then(success, error);
      }
    }
    $httpProvider.responseInterceptors.push(interceptor);
  });

  app.run(function($rootScope, $templateCache, $http, $location, $routeProvider) {
    $http.get("/api/user-pages").success(function(data){
      for(var i = 0; i < data.Pages.length; i++){

        $routeProvider.when('/' + data.Pages[i].Page.name, angularAMD.route({
          templateUrl: '/view/' + data.Pages[i].Page.name + '?' + Math.random(),
          controller: data.Pages[i].Page.name,
          controllerUrl: '/js/' + data.Pages[i].Page.name
        }));

        if(data.Pages[i].Page.name.indexOf('persist') != '-1'){
          $routeProvider.when('/' + data.Pages[i].Page.name + '/:id', angularAMD.route({
            templateUrl: '/view/' + data.Pages[i].Page.name + '?' + Math.random(),
            controller: data.Pages[i].Page.name,
            controllerUrl: '/js/' + data.Pages[i].Page.name + '?' + Math.random()
          }));
        };

      };
    }).error(function(){
      $location.path("/");
    });
  });
  return angularAMD.bootstrap(app);
});