define(['js/app'], function (app) {
  app.controller('searchdepartment', ['$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/department').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    })
  }]);
});
