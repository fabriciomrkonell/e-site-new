define(['js/app'], function (app) {
  app.controller('searchproductstar', ['$scope', '$http', function($scope, $http) {

    function getStars(){
      $http.get("/api/product-star").success(function(data){
        $scope.dados = data.data;
      });
    };

    getStars();

    angular.extend($scope, {
      dados: [],
      produto: ''
    });

    $scope.$watch('produto', function(newValue, oldValue){
      if(angular.isObject(newValue)){
        $scope.toogleStar(newValue.originalObject.id)
      }else{
        $scope.produto = '';
      }
    });

    $scope.toogleStar = function(produto){
      $http.post("/api/product-star/" + produto).success(function(data){
        getStars();
      });
    };

  }]);
});
