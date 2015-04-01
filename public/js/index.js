'use strict';

angular.module('app', []);

angular.module('app').controller('ctrl', ['$scope', '$http', function($scope, $http){

  function clear(){
    angular.extend($scope, {
      data: {
        login: true,
        username: 'fabricioronchii@gmail.com',
        password: 'admin'
      }
    });
  };

  clear();

  $scope.entrar = function(){
    $http.post('/login', $scope.data).success(function(data){
      if(data.success){
        window.location = '/admin/home';
      }else{
        alert('Email ou senha inválidos!');
      }
    }).error(function(error){
      alert('Erro ao fazer login!');
    });
  };

  $scope.getPassword = function(){
    $http.post('/api/recover-password', $scope.data).success(function(data){
      alert(data.message);
      $scope.toogle();
    });
  };

  $scope.toogle = function(){
    $scope.login = !$scope.login;
    clear();
  };

}]);