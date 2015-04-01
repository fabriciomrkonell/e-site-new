define(['js/app'], function (app) {
  app.controller('persistsaleproduct', ['$scope', '$http', '$routeParams', '$window', function($scope, $http, $routeParams, $window) {

    angular.extend($scope, {
      expressao: '',
      loader: true,
      dados: {}
    });

    function getAll(){
      $http.get("/api/sale-all/" + $routeParams.id).success(function(data){
        $scope.dados = data.data;
        $scope.loader = false;
      });
    }

    getAll();

    function clear(){
      $scope.expressao = '';
    };

    $scope.getFormatData = function(data){
      if(!data){
        return '';
      }
      data = data.toString();
      return data.slice(6, 8) + '/' + data.slice(4, 6) + '/' + data.slice(0, 4);;
    };

    $scope.existeExpressao = function(){
      return angular.isObject($scope.expressao);
    };

    $scope.excluir = function(id, index){
      $http.delete("/api/sale-product/" + id).success(function(data){
        $scope.dados.products.splice(index, 1);
        clear();
      });
    };

    $scope.adicionar = function(obj){
      for(var i = 0; i < $scope.dados.products.length; i++){
        if($scope.dados.products[i].Product.code == obj.originalObject.code){
          return alert("Esse produto já pertence a essa promoção!");
        }
      }
      $http.post("/api/sale-product", {
        "sale": $scope.dados.sale.id,
        "product": obj.originalObject.id
      }).success(function(data){
        alert(data.message);
        getAll();
        clear();
      })
    }

  }]);
});