define(['js/app'], function (app) {
  app.controller('persistdepartment', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    function clear(){
      angular.extend($scope, {
        update: false,
        dados: {
          id: null,
          description: null,
          message: null
        }
      });
    };

    $scope.clear = function(){
      if(window.location.hash == '#/persistdepartment'){
        clear();
      }else{
        window.location = '#/persistdepartment';
      }
    };

    if($routeParams.id != undefined){
      $scope.update = true;
      $http.get("/api/department/" + $routeParams.id).success(function(data){
        $scope.dados = data.data;
      });
    }else{
      clear();
    };

    $scope.persist = function(dados){
      $http.post("/api/department", dados).success(function(data){
        alert(data.message);
        if(!$scope.update){
          window.location = "#/persistdepartment/" + data.data;
        };
      });
    };

  }]);
});