define(['js/app'], function (app) {
  app.controller('searchsale', ['$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
      dados: []
    });

    $scope.getFormatData = function(data){
      data = data.toString();
      return data.slice(6, 8) + '/' + data.slice(4, 6) + '/' + data.slice(0, 4);;
    };

    $scope.excluir = function(obj, index, promocao){
      if(confirm("Deseja excluir a promoção " + obj.description + "?")){
        $http.delete('/api/sale/' + obj.id).success(function(data){
          $scope.dados[promocao].splice(index, 1);
        });
      }
    };

    $http.get('/api/sale').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

  }]);
});
