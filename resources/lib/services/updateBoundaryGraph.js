angular.module('indexApp').factory('updateBoundaryGraph', ['$rootScope', function($rootScope){
	var domain = [];
    for(var i = 0; i<20; i++)domain.push('');
    var colors = d3.scale.category20().range();

    //clears the svg canvas
    var boundaryX,boundaryY;
    
    return{
    	setScales : function(x,y){
    		boundaryX = x;
    		boundaryY = y;
    	},

    	update: function(){
		    var boundaryGraph =d3.select('.boundaryGraph');


	        var selectedPoints = d3.selectAll('.selected');
	        var boundaryPoints = [];
	        // console.log(selectedPoints);

	        //clears the svg canvas
	        boundaryGraph.selectAll(".line").remove();

	        if(!selectedPoints.empty()){
	            selectedPoints.data().forEach(function(element){
	                var tempArray = [{'X':0,'Y':0,'id':element.point.id}];
	                for(i = 0;i < 10; i++){
	                    tempArray.push({'Y':element.distanceList[i],"X":i+1});
	                }
	                tempArray.push({'X':11,'Y':element.distanceList[9]});
	                boundaryPoints.push(tempArray);

	            });

	            // console.log(boundaryPoints);

	            var line = d3.svg.line()
	                .interpolate("step-after")  
	                .x(function(d) { return boundaryX(d.X); })
	                .y(function(d) { return boundaryY(d.Y); });

                $rootScope.$broadcast('updateBoundary', {line:line,domain:domain, colors:colors, boundaryPoints:boundaryPoints});

	            console.log(domain); 

	            console.log('printed: ' +selectedPoints.size() +' points');
	        }
    	},

    	setDomain: function(newDomain){
    		domain = newDomain;
    	}
    };
}]);