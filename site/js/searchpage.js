define(['js/app'], function (app) {
  app.controller('searchpage', ['$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/page').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.excluir = function(obj, index){
      if(confirm("Deseja excluir a página " + obj.description + "?")){
        $http.delete('/api/page/' + obj.id).success(function(data){
          $scope.dados.splice(index, 1);
        });
      }
    };

  }]);
});
