define(['js/app'], function (app) {
  app.controller('persistgroup', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    function clear(){
      angular.extend($scope, {
        update: false,
        dados: {
          id: null,
          description: null
        }
      });
    };

    $scope.persist = function(dados){
      $http.post("/api/group", dados).success(function(data){
        alert(data.message);
        if(!$scope.update){
          window.location = "#/persistgroup/" + data.data;
        };
      });
    };

    $scope.clear = function(){
      if(window.location.hash == '#/persistgroup'){
        clear();
      }else{
        window.location = '#/persistgroup';
      }
    };

    if($routeParams.id != undefined){
      $scope.update = true;
      $http.get("/api/group/" + $routeParams.id).success(function(data){
        $scope.dados = data.data;
      });
    }else{
      clear();
    };

  }]);
});