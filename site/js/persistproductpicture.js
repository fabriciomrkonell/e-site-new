define(['js/app'], function (app) {
  app.controller('persistproductpicture', ['$scope', '$http', '$window', '$routeParams', function($scope, $http, $window, $routeParams) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/product-picture/' + $routeParams.id ).success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.submit = function(id, product){
      var form = 'myForm' + product;
      document[form].action = '/api/product-picture' + product + '/' + id;
      $("#" + form).ajaxSubmit({
        dataType: 'text',
        success: function(response) {
         document.getElementById("picture" + product).src = '/img/products/picture' + product  + '-' + id + '.png?' + Math.random();
         document.getElementById('pictureinput' + product).value = "";
        }
      });
    };

  }]);
});