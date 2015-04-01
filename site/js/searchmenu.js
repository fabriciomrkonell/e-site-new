define(['js/app'], function (app) {
  app.controller('searchmenu', ['$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/menu').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.excluir = function(obj, index){
      if(confirm("Deseja excluir o menu " + obj.description + "?")){
        $http.delete('/api/menu/' + obj.id).success(function(data){
          $scope.dados.splice(index, 1);
        });
      }
    };

    $scope.persist = function(dados){
      dados.status = !dados.status;
      $http.post("/api/menu", dados);
    };

  }]);
});
