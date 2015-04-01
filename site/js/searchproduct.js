define(['js/app'], function (app) {
  app.controller('searchproduct', ['$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
      produto: '',
      order: 'codigo',
      dados: []
    });

    $http.get("/api/product").success(function(data){
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.excluir = function(obj, index){
      if(confirm("Deseja excluir o produto " + obj.description + "?")){
        $http.delete('/api/product/' + obj.id).success(function(data){
          for(var i = 0; i < $scope.dados.length; i++){
            if($scope.dados[i].id == obj.id){
              $scope.dados.splice(i, 1);
              i = $scope.dados.length;
            }
          };
        });
      }
    };

  }]);
});
