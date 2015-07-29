angular.module('indexApp').controller('sliderCtrl',['$scope', '$http', 'updateKR', function($scope,$http, updateKR){

    $scope.kvalue=5;
    $scope.rvalue=5000;

    $scope.updateKRValue = function(){
        updateKR.setKR($scope.kvalue, $scope.rvalue);
    };

}]);
