define(['js/app'], function (app) {
  app.controller('searchgrouppage', ['$scope', '$http', function($scope, $http) {

    angular.extend($scope, {
      dados: []
    });

    $http.get('/api/view/grouppage').success(function(data) {
      angular.extend($scope, {
        dados: data.data
      });
    });

    $scope.persist = function(PageId, GroupId){
      var obj = {
        PageId: PageId,
        GroupId: GroupId
      };
      $http.post("/api/grouppage", obj);
    };

    $scope.isChecked = function(PageId, GroupId){
      var _return = false;
      for(var i = 0; i < $scope.dados.GroupPages.length; i++){
        if($scope.dados.GroupPages[i].GroupId == GroupId && $scope.dados.GroupPages[i].PageId == PageId){
          _return = true;
          i = $scope.dados.GroupPages.length;
        }
      }
      return _return;
    };

  }]);
});
