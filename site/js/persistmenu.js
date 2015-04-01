define(['js/app'], function (app) {
  app.controller('persistmenu', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    function clear(){
      angular.extend($scope, {
        update: false,
        dados: {
          id: null,
          description: null,
          url: null,
          position: 1,
          status: false
        }
      });
    };

    $scope.persist = function(dados){
      $http.post("/api/menu", dados).success(function(data){
        alert(data.message);
        if(!$scope.update){
          window.location = "#/persistmenu/" + data.data;
        };
      });
    };

    $scope.clear = function(){
      if(window.location.hash == '#/persistmenu'){
        clear();
      }else{
        window.location = '#/persistmenu';
      }
    };

    if($routeParams.id != undefined){
      $scope.update = true;
      $http.get("/api/menu/" + $routeParams.id).success(function(data){
        $scope.dados = data.data;
      });
    }else{
      clear();
    };

  }]);
});