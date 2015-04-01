define(['js/app'], function (app) {
  app.controller('persistproduct', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout) {

    angular.extend($scope, {
      data: {}
    });

    function clear(){
      angular.extend($scope, {
        update: false,
        dados: {
          id: null,
          code: null,
          description: null,
          newValue: null,
          DepartmentId: null
        }
      });
    };

    clear();

    $scope.persist = function(dados){
      $http.post("/api/product", dados).success(function(data){
        alert(data.message);
        if(!$scope.update){
          window.location = "#/persistproduct/" + data.data;
        };
      });
    };

    $scope.clear = function(){
      if(window.location.hash == '#/persistproduct'){
        clear();
      }else{
        window.location = '#/persistproduct';
      }
    };

    $http.get('/api/view/persistproduct').success(function(data){
      $scope.data = data.data;
    });

    if($routeParams.id != undefined){
      $scope.update = true;
      $http.get("/api/product/" + $routeParams.id).success(function(data){
        $scope.dados = data.data;
        $timeout(function(){
          $scope.dados.DepartmentId = data.data.DepartmentId;
          document.getElementById('department').value = data.data.DepartmentId;
        });
      });
    };

  }]);
});