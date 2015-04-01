define(['js/app'], function (app) {
  app.controller('persistsale', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    function getFormatStartDate(dados){
      return dados.startDateYear + '' + dados.startDateMonth + '' + dados.startDateDay;
    };

    function getFormatFinishDate(dados){
      return dados.finishDateYear + '' + dados.finishDateMonth + '' + dados.finishDateDay;
    };

    function getFloatDate(data){
      data = data.toString();
      if(data.length == 1){
        return "0" + data;
      }
      return data;
    };

    function clear(){
      var _data = new Date();
      angular.extend($scope, {
        dados: {
          id: null,
          description: null,
          startDateDay: getFloatDate(_data.getDate()),
          startDateMonth: getFloatDate(_data.getMonth() + 1),
          startDateYear: _data.getFullYear(),
          finishDateDay: getFloatDate(_data.getDate()),
          finishDateMonth: getFloatDate(_data.getMonth() + 1),
          finishDateYear: _data.getFullYear()
        }
      });
    };

    angular.extend($scope, {
      update: false
    });

    if($routeParams.id != undefined){
      angular.extend($scope, {
        update: true
      });
      $http.get("/api/sale/" + $routeParams.id).success(function(data){
        data = data.data;
        angular.extend($scope, {
          dados: {
            id: data.id,
            description: data.description,
            startDateDay: data.startDate.toString().slice(6, 8),
            startDateMonth: data.startDate.toString().slice(4, 6),
            startDateYear: data.startDate.toString().slice(0, 4),
            finishDateDay: data.finishDate.toString().slice(6, 8),
            finishDateMonth: data.finishDate.toString().slice(4, 6),
            finishDateYear: data.finishDate.toString().slice(0, 4)
          }
        });
      });
    }else{
      clear();
    };

    $scope.clear = function(){
      if(window.location.hash == '#/persistsale'){
        clear();
      }else{
        window.location = '#/persistsale';
      }
    };

    $scope.persist = function(dados){
      var persist = {
        id: dados.id,
        description: dados.description,
        startDate: getFormatStartDate(dados),
        finishDate: getFormatFinishDate(dados)
      };
      $http.post("/api/sale", persist).success(function(data){
        alert(data.message);
        if(!$scope.update){
          window.location = "#/persistsale/" + data.data;
        };
      });
    };
  }]);
});