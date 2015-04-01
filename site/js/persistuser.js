define(['js/app'], function (app) {
  app.controller('persistuser', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout) {

    function clear(){
      angular.extend($scope, {
        update: false,
        dados: {
          id: null,
          name: null,
          email: null,
          password: null,
          GroupId: null
        }
      });
    };

    $scope.data = {};

    $scope.persist = function(dados){
      $http.post("/api/user", dados).success(function(data){
        alert(data.message);
        if(!$scope.update){
          window.location = "#/persistuser/" + data.data;
        };
      });
    };

    $scope.clear = function(){
      if(window.location.hash == '#/persistuser'){
        clear();
      }else{
        window.location = '#/persistuser';
      }
    };

    if($routeParams.id != undefined){
      $scope.update = true;
      $http.get("/api/user/" + $routeParams.id).success(function(data){
        $scope.dados = data.data;
        $timeout(function(){
          $scope.dados.GroupId = data.data.GroupId;
          document.getElementById('group').value = data.data.GroupId;
        });
      });
    }else{
      clear();
    };

    $http.get("/api/view/persistuser").success(function(data){
      $scope.data = data.data;
    });

  }]);
});