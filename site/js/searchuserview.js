define(['js/app'], function (app) {
  app.controller('searchuserview', ['$scope', '$http', function($scope, $http){

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/user-me').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.persist = function(dados){
      $http.post('/api/user', dados).success(function(data) {
        alert(data.message);
      });
    };

  }]);
});
