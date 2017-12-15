var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Coverage:</strong> <span style='color:red'>" + d.coverage + "</span>";
  })

var svg = d3.select("body").append("svg")
    // .attr('id', 'barchart-svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("data/vaccines-melt.csv", type, function(error, data) {

  // x.domain(data.map(function(d) { return d.Vaccine; }));
  // y.domain([0, d3.max(data, function(d) { return d.value; })]);
  var selected_vaccine = 'BCG';
  var selected_year = 2016;
  var selected_data = [];
  data.forEach(function(d) {
    if (d.Vaccine == selected_vaccine && d.variable == selected_year) {

      selected_data.push({'country': d.Cname, 'coverage': d.value});
    }
  });

  console.log(selected_data);
  var sorted = selected_data.sort(function(a,b){return b.coverage - a.coverage});
  console.log(sorted);

  var top20 = selected_data.slice(0, 20);
  console.log(top20);

  x.domain(top20.map(function(d) { return d.country; }));
  y.domain([0, d3.max(top20, function(d) { return d.coverage; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-45)"
                });;

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population Percentage");

  svg.selectAll(".bar")
      .data(top20)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.country); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.coverage); })
      .attr("height", function(d) { return height - y(d.coverage); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});


function type(d) {
  d.value= +d.value;
  return d;
}
