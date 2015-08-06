angular.module('indexApp').directive('dataplane',['updateBoundaryGraph','densityMatrix', function(updateBoundaryGraph,densityMatrix){
    function link(scope,element,attr){
        /**
         * Created by Tommzy on 7/7/2015.
         */
        var data = scope.data;
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        /*
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         */
        // setup x
        var xValue = function(d) { return d.point.lat;}, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) { return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom")
                .innerTickSize(-height);

        // setup y
        var yValue = function(d) { return d.point.lon;}, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left")
                .innerTickSize(-width);

        // setup zoom
        var zoom = d3.behavior.zoom()
            .scaleExtent([1,10])
            .on("zoom", zoomed);

        // setup zoomed function
        function zoomed() {
            var t = d3.event.translate,
                s = d3.event.scale;
            //comstrain zoomed window to bounds of graph
            t[0] = Math.max(-width*(s-1), Math.min(t[0], 0));
            t[1] = Math.max(-height*(s-1), Math.min(t[1], 0));
            zoom.translate(t);

            //redraws axis
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            //redraws points
            svg.selectAll('.dataPoint')
                .attr("cx", function(d, i) { return xMap(d); })
                .attr("cy", function(d, i) { return yMap(d); });
        }

        // setup fill color
        var cValue = function(d) { return d.type;},
            color = d3.scale.category10();

        // add the graph svg to the body of the webpage
        var svg = d3.select(element[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .classed('boundary',true)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

        // sets up graph rectangle
        svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr('fill','#ddd')
            .attr('stroke','black')
            .style("pointer-events", "all");

        // sets up clip path
        svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // add the tooltip area to the webpage
        var tooltip = d3.select(element[0]).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // load data
        d3.json("resources/lib/sampleJSONs/dataplane.json", function(error, data) {
//				data.forEach(function(element){
//				// change string (from JSON) into number format
//				element.point.lat= +element.point.lat;
//				element.point.lon = +element.point.lon;
//				element.point.id=+element.point.id;
//				});

            densityMatrix.setData(data);
            console.log("Finish loading data plane values");

            // sets domain of the scales
            xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
            yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

            zoom.x(xScale).y(yScale);

            // x-axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width -6)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("latittude");

            // y-axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("x", -6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("longitude");

            // draw dots
            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .classed('dataPoint', true)
                .attr("clip-path", "url(#clip)")
                .attr('id', function(d){return 'id'+d.point.id; })
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1.4);
                    tooltip.html("ID: "+ d.point.id + "<br/> (" + xValue(d)
                        + ", " + yValue(d) + ")")
                        .style("left", (d3.event.layerX + 5) + "px")
                        .style("top", (d3.event.layerY - 28) + "px");
                })
                // creates point selection functionality
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on('click', function(d){
                    var clickedPoint = d3.select(this);
                    var currentlySelected =clickedPoint.classed('selected');

                    if(currentlySelected) clickedPoint.classed('deselected',true);
                    clickedPoint.classed('selected',!currentlySelected);
                    console.log('Selected Point');
                    updateBoundaryGraph.update();

                });


            //// draw legend
            //var legend = svg.selectAll(".legend")
            //    .data(color.domain())
            //    .enter().append("g")
            //    .attr("class", "legend")
            //    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            //// draw legend colored rectangles
            //legend.append("rect")
            //    .attr("x", width-18)
            //    .attr("width", 18)
            //    .attr("height", 18)
            //    .style("fill", color)
            //    .style("opacity", 1);;
            //
            //// draw legend text
            //legend.append("text")
            //    .attr("x", width - 24)
            //    .attr("y", 9)
            //    .attr("dy", ".35em")
            //    .style("text-anchor", "end")
            //    .text(function(d) { return d;})
            //var legends=[
            //    {
            //        class_name: 'outlier', actual_name: 'Outlier'
            //    },
            //    {
            //        class_name: 'dataPoint', actual_name: 'Inlier'
            //    },
            //    {
            //        class_name: 'constOut', actual_name: 'Constant Outlier'
            //    },{
            //        class_name: 'constIn', actual_name: 'Constant Inlier'
            //    }
            //];
            //var legend = svg.selectAll(".legend")
            //    .data(legends)
            //    .enter().append("g")
            //    .attr("class", "legend")
            //    .attr("transform", function(d, i) { return "translate(" + i * 20 + ",0)"; });
            //
            //// draw legend colored rectangles
            //legend.append("rect")
            //    .attr("x", width+15)
            //    .attr("width", 18)
            //    .attr("height", 18)
            //    .attr("class",function(d){
            //        return d.class_name;
            //    });
            //
            //// draw legend text
            //legend.append("text")
            //    .attr("x", width +20)
            //    .attr("y", 9)
            //    .attr("dy", ".35em")
            //    .style("text-anchor", "end")
            //    .text(function(d) { return d.actual_name;})


        });

    }
    return{
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
}]);