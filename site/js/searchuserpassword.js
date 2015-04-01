define(['js/app'], function (app) {
  app.controller('searchuserpassword', ['$scope', '$http', function($scope, $http) {

    function clear(){
      angular.extend($scope, {
        dados: {
          password: '',
          newPassword: ''
        }
      });
    };

    clear();

    $scope.persist = function(dados){
      $http.post('/api/user-password', dados).success(function(data){
        alert(data.message);
        clear();
      });
    };

  }]);
});