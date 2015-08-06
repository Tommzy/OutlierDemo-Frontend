angular.module('indexApp').controller('legendCtrl',['$scope', '$window', function($scope,$window){
    // sets up tabs that are under development

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width-18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)
        .style("opacity", 1);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})

    return{
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };


}]);