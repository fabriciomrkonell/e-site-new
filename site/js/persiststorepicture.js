define(['js/app'], function (app) {
  app.controller('persiststorepicture', ['$scope', '$http', '$window', '$routeParams', function($scope, $http, $window, $routeParams) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/store-picture/' + $routeParams.id ).success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.submit = function(id, loja){
      var form = 'myForm' + loja;
      document[form].action = '/api/store-picture' + loja + '/' + id;
      $("#" + form).ajaxSubmit({
        dataType: 'text',
        success: function(response) {
         document.getElementById("picture" + loja).src = '/img/stores/picture' + loja  + '-' + id + '.png?' + Math.random();
         document.getElementById('pictureinput' + loja).value = "";
        }
      });
    };

  }]);
});