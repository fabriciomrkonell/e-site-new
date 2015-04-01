define(['js/app'], function (app) {
  app.controller('searchgroup', ['$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/group').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.excluir = function(obj, index){
      if(confirm("Deseja excluir o grupo " + obj.description + "?")){
        $http.delete('/api/group/' + obj.id).success(function(data){
          $scope.dados.splice(index, 1);
        });
      }
    };

  }]);
});
