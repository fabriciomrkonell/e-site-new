define(['js/app'], function (app) {
  app.controller('searchstore', ['$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/store').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

  }]);
});
