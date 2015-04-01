define(['js/app'], function (app) {
  app.controller('searchcandidates', ['$scope', '$http', function($scope, $http) {

  angular.extend($scope, {
    dados: []
  });

  $http.get('/api/curriculo').success(function(data){
    angular.extend($scope, {
      dados: data.data
    });
  });

  $scope.gerarPDF = function(id) {
    window.open('/api/curriculo/pdf/' + id);
  };

  $scope.gerarDocumento = function(id) {
    window.open('/api/curriculo/documento/' + id);
  };

  $scope.excluir = function(id, index) {
    var _confirm = confirm("Deseja realmente excluir?");
    if(_confirm){
      $http.delete("/api/curriculo/" + id).success(function(data){
        $scope.dados.splice(index, 1);
      });
    }
  };

  }]);
});
