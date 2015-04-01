define(['js/app'], function (app) {
  app.controller('persistemail', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout) {

    function clear(){
      angular.extend($scope, {
        update: false,
        dados: {
          configuration: 'work-with-us',
          email: null,
          password: null,
          host: null,
          port: null,
          status: true
        }
      });
    };

    clear();

    $scope.persist = function(dados){
      $http.post("/api/email", dados).success(function(data){
        alert(data.message);
        if(!$scope.update){
          window.location = "#/persistemail/" + data.data;
        };
      });
    };

    $scope.clear = function(){
      if(window.location.hash == '#/persistemail'){
        clear();
      }else{
        window.location = '#/persistemail';
      }
    };

    if($routeParams.id != undefined){
      $scope.update = true;
      $http.get("/api/email/" + $routeParams.id).success(function(data){
        $scope.dados = data.data;
      });
    };

  }]);
});