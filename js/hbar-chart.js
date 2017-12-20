// define(["d3v4"], function(d3) {
  // this.d3 = d3;
// console.log(d3);

// console.log(basic_chloropleth.slider_year);
var svg = d3.select("#hbar-svg"),
  margin = {top: 20, right: 20, bottom: 30, left: 80},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);

var g = svg.append("g")
  .attr('class', 'hbar')
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var colors = colorbrewer.GnBu[9];

var mean_coverage_by_year;

d3.csv("data/test-mean.csv", function(error, data) {
  if (error) throw error;
  // console.log(data);
  this.mean_coverage_by_year = data;
  var mean_coverage_1980 = getCoverageData(1980, null);
  draw(mean_coverage_1980);
});

// country_coverage
function update(data) {
  data.sort(function(a, b) { return a.Coverage - b.Coverage; });
  // console.log(data);
	x.domain([0, 100]);
  y.domain(data.map(function(d) { return d.Vaccine; })).padding(0.1);

  var color_scale = d3.scaleQuantize()
          .domain([0, data.length])
          .range(colors);

  // left axis
	g.select('.y.axis')
		  .call(d3.axisLeft(y))
	//bottom axis
	g.select('.x.axis')
    .call(d3.axisBottom(x));

	//select all bars on the graph, take them out, and exit the previous data set.
	//then you can add/enter the new data set
	var bars = g.selectAll(".bar")
                .remove().exit()
        				.data(data)

	//now actually give each rectangle the corresponding data
	bars.enter().append("rect")
    .attr("class", "bar")
    .attr('id', function(d) {
      if (d.Vaccine == selected_vaccine) {
        highlightBars(this);
        return 'selected-hbar'}
    })
    .attr("x", 0)
    .attr("height", y.bandwidth())
    .style('fill',function(d,i){ return color_scale(i); })
    .attr("y", function(d) { return y(d.Vaccine); })
    .attr("width", function(d) { return x(d.Coverage); })
    .on("mouseover", function(d){
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html((d.Vaccine) + "<br>" + (d.Coverage) + '%');
    })
    .on("mouseout", function(d){ tooltip.style("display", "none");})
    .on('click', function(d) { handleVaccineSelection(this, d); })


}

function draw(data) {

	data.sort(function(a, b) { return a.Coverage - b.Coverage; });

	x.domain([0, 100]);
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
      .attr("width", function(d) { return x(d.Coverage); })
      .on("mouseover", function(d){
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html((d.Vaccine) + "<br>" + (d.Coverage) + '%');
      })
  		.on("mouseout", function(d){ tooltip.style("display", "none");})
      .on('click', function(d) {handleVaccineSelection(this, d)});

};

function highlightBars(selected) {
  console.log(selected);
  // make all bars transparent
  g.selectAll("rect").style("stroke-width", 0)
                      .style('opacity', 0.6);
  // except for the bar clicked on
  d3.select(selected).style("stroke-width", 2)
                     .style("stroke", 'black')
                     .style('opacity', 1);
}

function handleVaccineSelection(selected, d) {
  highlightBars(selected);
  // set global selected vaccine
  selected_vaccine = d.Vaccine;
  // update display
  d3.select('#vaccine-display')
    .html(selected_vaccine)
    .attr('class', selected_vaccine)

  // Call function to update map
  onchange(selected_vaccine);
};

var getCoverageData = function(selected_year, selected_country) {
  var result = [];

  if (selected_year && selected_country) {
    console.log(data);
    data.forEach(function(d) {
      if ((d.ISO_code == selected_country)) {
        // console.log(parseInt(selected_year), d[parseInt(selected_year)]);
        result.push({'Vaccine': d.Vaccine, 'Coverage': d[selected_year]})
      }
    });
  }
  else if (selected_year) {
    mean_coverage_by_year.forEach(function(d) {
      if (d.Year == selected_year) {
        result.push({'Vaccine': d.Vaccine, 'Coverage': d.Coverage})
      }
    });
  }

  return result;
}

function updateHBar(selected_year, selected_country) {
  console.log(selected_year, selected_country, selected_vaccine)
  var mean_coverage_data = getCoverageData(selected_year, selected_country)
  console.log(mean_coverage_data);
  update(mean_coverage_data);
}
// });
