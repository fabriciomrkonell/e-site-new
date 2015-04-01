define(['js/app'], function (app) {
  app.controller('searchbanner', ['$scope', '$http', '$window', '$timeout', function($scope, $http, $window, $timeout) {

    angular.extend($scope, {
      update: false,
      dados: []
    });

    $http.get('/api/banner').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.salvar = function(){
      $http.post("/api/banner").success(function(data){
        $scope.dados.push(data.data)
      });
    };

    $scope.excluir = function(id, index){
      $http.delete("/api/banner/" + id).success(function(data){
        $scope.dados.splice(index, 1);
      });
    };

    $scope.submit = function(id){
      var form = 'myForm' + id;
      document[form].action = '/api/banner-picture/' + id;
      $("#" + form).ajaxSubmit({
        dataType: 'text',
        success: function(response) {
          document.getElementById("banner" + id).src = '/img/banners/' + id + '.png?' + Math.random();
          document.getElementById('pictureinput' + id).value = "";
        }
      });
    };

    $scope.saveURL = function(dados){
      $http.post("/api/banner", dados);
    };

  }]);
});