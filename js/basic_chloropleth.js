//--- Map
var map = d3.geomap.choropleth()
    .geofile('d3-geomap/topojson/world/countries.json')
    .colors(colorbrewer.YlGnBu[9])
    .column('2016')
    .legend(true)
    .unitId('ISO_code');


d3.csv('data/vaccinaties.csv', function(error, data) {
    // set data to global
    this.data = data;

    // get unique vaccine names
    var vaccines = getLabels();
    // get years
    var years = getYears();

    // call select func to create dropdown and add labels
    var select_vaccine = d3.select('#dropdown-vaccine')
      .append('select')
      	.attr('class','select')
        .attr('id','vaccine-select')
        .on('change', onchange);

    var select_year = d3.select('#dropdown-year')
      .append('select')
      	.attr('class','select')
        .attr('id','year-select')
        .on('change', onchange);

    //  set selction options
    var options_vaccine = select_vaccine
      .selectAll('option')
    	.data(vaccines).enter()
    	.append('option')
    	.text(function (d) { return d; });

    var options_year = select_year
      .selectAll('option')
    	.data(years).enter()
    	.append('option')
        .attr('class','option')
        .attr('id', function(d) { return d; })
    	.text(function (d) { return d; });

    // get selections
    selected_vaccine = d3.select('#vaccine-select').property('value')
    selected_year = d3.select('#year-select').property('value')

    // get data for selected Vaccine and update selected year
    var data_vaccine = getData(selected_vaccine);

    // add data to map and draw
    d3.select('#map')
        .datum(data_vaccine)
        .call(map.draw, map);
    // map.column(selected_year).update()
});

function getData(selected) {
  var result = [];
  data.forEach(function(d) {
    if(d.Vaccine == selected) {
        result.push(d);
    }
  });
  return result;
}

function getLabels() {
  var uniqueNames = [];
  data.forEach(function(d) {
    if(uniqueNames.indexOf(d.Vaccine) === -1){
        uniqueNames.push(d.Vaccine);
    }
  });
  return uniqueNames;
};

function getYears() {
  var years = [];
  var headers = Object.keys(data[0]);
  headers.forEach(function(h) {
    if(!isNaN(h)) {
      years.push(h);
    }
  });
  return years;
};

function onchange() {
  // get selected value
	selected_vaccine = d3.select('#vaccine-select').property('value');
  selected_year = d3.select('#year-select').property('value');

  // set new map data
  map.data = getData(selected_vaccine);
  map.column(selected_year).update();

  // update map
  map.update()
};



// ---- Slider ----
var svg = d3.select("svg"),
    margin = {right: 10, left: 10},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height");

var x = d3.scaleLinear()
    .domain([0, 180])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3.event.x)); })
      );

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(10))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "°"; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider.transition() // Gratuitous intro!
  .duration(750)
  .tween("hue", function() {
    var i = d3.interpolate(0, 70);
    return function(t) { hue(i(t)); };
});

function hue(h) {
  handle.attr("cx", x(h));
  svg.style("background-color", d3.hsl(h, 0.8, 0.8));
}
