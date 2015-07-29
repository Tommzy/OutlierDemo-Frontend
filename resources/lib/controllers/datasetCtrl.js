angular.module('indexApp').controller('datasetCtrl',['$scope', '$http', 'updateBoundaryGraph', function($scope,$http, updateBoundaryGraph){

	$scope.$on('updateKR', function(event, args) {

		console.log('Received Broadcast');

		var data= args.data;

        //reset current outliers
        d3.selectAll('.outlier')
            .classed('outlier', false);
        //mark outliers
        data.forEach(function(element){
            var sPoint = d3.select('#id'+element.id.toString());
            if(sPoint){
                console.log(sPoint.data()[0].point.id);
                sPoint.classed('outlier', true);
                console.log(sPoint.classed('outlier'));
            }
        });

	});

	$scope.$on('updateBoundary', function(event, args){
		var domain = args.domain;
		var deselected = d3.select('.deselected');

        deselected.classed('deselected', false);
        if(deselected[0][0]){
            console.log(deselected);
            var dIndex = domain.indexOf(deselected.data()[0].point.id);
            domain[dIndex]='';
        }
        updateBoundaryGraph.setDomain(domain);

	});
}]);