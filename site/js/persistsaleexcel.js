define(['js/app'], function (app) {
  app.controller('persistsaleexcel', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {

    function getFormatData(data){
      data = data.toString();
      return data.slice(6, 8) + '/' + data.slice(4, 6) + '/' + data.slice(0, 4);;
    };

    angular.extend($scope, {
      dados: [],
      upload: true
    });

    $http.get("/api/sale/" + $routeParams.id).success(function(data){
      data = data.data;
      angular.extend($scope.dados, {
        id: data.id,
        description: data.description,
        startDate: getFormatData(data.startDate),
        finishDate: getFormatData(data.finishDate)
      });
    });

    $scope.submit = function(){
      $scope.erros = [];
      $scope.upload = false;
      document.myForm.action = '/api/sale-excel/' + $routeParams.id;
      $("#myForm").ajaxSubmit({
        dataType: 'text',
        success: function(response) {
          $scope.upload = true;
          response = $.parseJSON(response);
          if(response.success == 0) {
            $scope.erros.push(response.message);
            $scope.$digest();
            return false;
          }
          window.location = '#/searchsale';
        }
      });
    };

  }]);
});