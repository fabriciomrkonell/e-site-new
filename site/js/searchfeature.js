define(['js/app'], function (app) {
  app.controller('searchfeature', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/feature/' + $routeParams.id).success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.persist = function(dados){
    	dados.ProductId = $routeParams.id;
    	dados.feature = dados.feature || '';
    	dados.description = dados.description || '';
     	$http.post("/api/feature", dados).success(function(data){
      	alert(data.message);
      });
    };

    $scope.create = function(){
    	var dados = {};
    	dados.ProductId = $routeParams.id;
    	dados.feature = '';
    	dados.description = '';
      $http.post("/api/feature", dados).success(function(data){
      	$scope.dados.features.push(data.data)
      });
    };

    $scope.excluir = function(obj, index){
    	if(confirm("Deseja excluir a característica " + obj.feature + "?")){
        $http.delete("/api/feature/" + obj.id).success(function(data){
        	$scope.dados.features.splice(index, 1);
      	});
      }
    };

  }]);
});