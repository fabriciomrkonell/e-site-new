define(['js/app'], function (app) {
  app.controller('searchemail', ['$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/email').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.excluir = function(obj, index){
      if(confirm("Deseja excluir o email " + obj.email + "?")){
        $http.delete('/api/email/' + obj.id).success(function(data){
          $scope.dados.splice(index, 1);
        });
      }
    };

    $scope.getConfiguration = function(configuration){
      if(configuration == 'work-with-us'){
        return "Trabalhe conosco";
      }
      if(configuration == 'register'){
        return "Cadastre-se";
      }
      if(configuration == 'recover-password'){
        return "Recuperar senha";
      }
      return "";
    };

  }]);
});
