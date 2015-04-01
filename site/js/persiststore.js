define(['js/app'], function (app) {
  app.controller('persiststore', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    function clear(){
      angular.extend($scope, {
        update: false,
        dados: {
          id: null,
          name: null,
          email: null,
          phone: null,
          manager: null,
          treatment: null,
          lat: null,
          lon: null
        }
      });
    };

    $scope.persist = function(dados){
      $http.post("/api/store", dados).success(function(data){
        alert(data.message);
        if(!$scope.update){
          window.location = "#/persiststore/" + data.data;
        };
      });
    };

    $scope.clear = function(){
      if(window.location.hash == '#/persiststore'){
        clear();
      }else{
        window.location = '#/persiststore';
      }
    };

    if($routeParams.id != undefined){
      $scope.update = true;
      $http.get("/api/store/" + $routeParams.id).success(function(data){
        $scope.dados = data.data;
      });
    }else{
      clear();
    };

  }]);
});