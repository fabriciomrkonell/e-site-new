define(['js/app'], function (app) {
  app.controller('persistpage', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    function clear(){
      angular.extend($scope, {
        update: false,
        dados: {
          id: null,
          description: null,
          position: null
        }
      });
    };

    $scope.persist = function(dados){
      $http.post("/api/page", dados).success(function(data){
        alert(data.message);
        if(!$scope.update){
          window.location = "#/persistpage/" + data.data;
        };
      });
    };

    $scope.clear = function(){
      if(window.location.hash == '#/persistpage'){
        clear();
      }else{
        window.location = '#/persistpage';
      }
    };

    if($routeParams.id != undefined){
      $scope.update = true;
      $http.get("/api/page/" + $routeParams.id).success(function(data){
        $scope.dados = data.data;
      });
    }else{
      clear();
    };

  }]);
});