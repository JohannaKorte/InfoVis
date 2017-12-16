var svg = d3.select("#hbar-svg"),
  margin = {top: 20, right: 20, bottom: 30, left: 80},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);

var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var colors = colorbrewer.YlGnBu[9];
// var colors = colorbrewer.Spectral[11];
console.log(colorbrewer);

d3.csv("data/mean_coverage_2016.csv", function(error, data) {
	if (error) throw error;

	data.sort(function(a, b) { return a.coverage - b.coverage; });

	x.domain([0, d3.max(data, function(d) { return d.coverage; })]);
  y.domain(data.map(function(d) { return d.Vaccine; })).padding(0.1);

  var color_scale = d3.scaleQuantize()
  				.domain([0, data.length])
  				.range(colors);

  g.append("g")
      .attr("class", "x axis")
     	.attr("transform", "translate(0," + height + ")")
    	.call(d3.axisBottom(x).ticks(11).tickSizeInner([-height]));

  g.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));

  g.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .style('fill',function(d,i){ return color_scale(i); })
      .attr("y", function(d) { return y(d.Vaccine); })
      .attr("width", function(d) { return x(d.coverage); })
      .on("mousemove", function(d){
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html((d.Vaccine) + "<br>" + (d.coverage) + '%');
      })
  		.on("mouseout", function(d){ tooltip.style("display", "none");})
      .on('click', function(d) { g.selectAll("rect").style("stroke-width", 0)
                                                    .style('opacity', 0.5);
                                console.log(this); console.log(d);
                                d3.select(this).style("stroke-width", 2)
                                               .style("stroke", 'black')
                                               .style('opacity', 1);
                               })
});

function highlightBar(bar) {
  console.log('hightlight')
  console.log(bar);
  g.selectAll("rect")
      .style("stroke-width", 0)

  d3.select(bar).style("stroke-width", 2).style("stroke", 'black')
};
