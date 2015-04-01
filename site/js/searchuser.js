define(['js/app'], function (app) {
  app.controller('searchuser', ['$scope', '$http', function($scope, $http){

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/user').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

  }]);
});
