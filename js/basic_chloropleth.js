// NOTE: By declaring a variable without 'var', makes it a global variable

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
    var select = d3.select('#dropdown')
      .append('select')
      	.attr('class','select')
        .attr('id','vaccine-select')
        .on('change', onchange);

    //  set selction options
    var options = select
      .selectAll('option')
    	.data(vaccines).enter()
    	.append('option')
    	.text(function (d) { return d; });

    // get selections
    var selected_vaccine = d3.select('#vaccine-select').property('value')

    // get data for selected Vaccine and update selected year
    var data_vaccine = getData(selected_vaccine);

    // add data to map and draw
    d3.select('#map')
        .datum(data_vaccine)
        .call(map.draw, map);

    // add Slider
    addSlider(data);
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
    if(h && !isNaN(h) ) {
      years.push(h);
    }
  });
  return years;
};

function onchange() {
  // get selected value
	var selected_vaccine = d3.select('#vaccine-select').property('value');
  // set new map data
  map.data = getData(selected_vaccine);
  // update map
  map.update()
};



// ---- Slider ----
function addSlider(data) {
  svg = d3.select("svg"),
  margin = {right: 15, left: 15},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height");

  years = getYears();

  x = d3.scaleLinear()
      .domain([0, years.length - 1])
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
          .on("start drag", function() { updateMap(x.invert(d3.event.x)); })
        );

  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 20 + ")")
    .selectAll("text")
    .data(x.ticks(years.length))
    .enter().append("text")
      .attr("x", x)
      .attr("text-anchor", "middle")
      .text(function(d) { return years[d]; });

  handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

  slider.transition() // Gratuitous intro!
    .duration(750)
    .tween("updateMap", function() {
      var i = d3.interpolate(0, 25);
      return function(t) { updateMap(i(t)); };
  });

  console.log('# years: ' + years.length)
};

function updateMap(h) {
  // adjust slider position
  handle.attr("cx", x(h));
  // get year from slider value
  var slider_value = Math.round(h);
  var slider_year = years[slider_value];
  console.log(h)
  console.log(slider_value)
  map.column(slider_year).update();

  // (tijdelijk) just cause it's pretty
  svg.style("background-color", d3.hsl(h, 0.8, 0.8));
}
