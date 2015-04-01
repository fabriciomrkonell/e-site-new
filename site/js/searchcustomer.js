define(['js/app'], function (app) {
  app.controller('searchcustomer', ['$scope', '$http', function($scope, $http) {

  angular.extend($scope, {
    dados: []
  });

  $http.get('/api/customer').success(function(data){
    angular.extend($scope, {
      dados: data.data
    });
  });

  $scope.excluir = function(obj, index) {
    if(confirm('Deseja realmente excluir o cliente ' + obj.name + '?')){
      $http.delete("/api/customer/" + obj.id).success(function(data){
        $scope.dados.splice(index, 1);
      });
    }
  };

  }]);
});
