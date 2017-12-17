// NOTE: By declaring a variable without 'var', makes it a global variable

// |---------------- Map -------------------|
var map = d3.geomap.choropleth()
    .geofile('d3-geomap/topojson/world/countries.json')
    .colors(colorbrewer.YlGnBu[9])
    .width('800')
    .scale(150)
    .legend(true)
    .unitId('ISO_code')
    .zoomFactor(3);

// TODO: adjust legend, and color ranges
// see similar visualization using same data: http://apps.who.int/gho/cabinet/uhc.jsp


d3.csv('data/vaccinaties.csv', function(error, data) {
    // set data to global
    this.data = data;

    // get unique vaccine names
    var vaccines = getLabels();
    // get years
    var years = getYears();

    // TODO: make this general
    // get selections
    var selected_vaccine = 'BCG'

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

function onchange(selected_vaccine) {
  console.log('onchange');
  // get selected value
	// var selected_vaccine = d3.select('#vaccine-select').property('value');
  // var selected = document.getElementById("#hbar-svg").contentWindow.selected_hbar;

  console.log(selected_vaccine)
  // set new map data
  map.data = getData(selected_vaccine);
  // update map
  map.update()
};



// |-------------------- Slider ------------------------|
function addSlider(data) {
  svg = d3.select("#slider-svg"),
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
      .attr('class', 'slider-tick')
      .attr("text-anchor", "middle")
      .text(function(d) { return years[d]; });

  handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 8);

  slider.transition() // Gratuitous intro!
    .duration(750)
    .tween("updateMap", function() {
      var i = d3.interpolate(0, 25);            // 25 is a random number
      return function(t) { updateMap(i(t)); };
  });
};

function updateMap(h) {
  // adjust slider position
  handle.attr("cx", x(h));

  // get year from slider value
  slider_year = years[Math.round(h)];

  // update map data
  map.column(slider_year).update();

  // make tickmark text big and bold when year is selected
  d3.selectAll('.slider-tick').nodes().forEach(function(t){

    if (parseInt(t.innerHTML) == slider_year) {
      d3.select(t).style('font-weight', 'bold')
                  .style('font-size', '120%');

    } else {
      d3.select(t).style('font-weight', 'normal')
                  .style('font-size', '100%');
    }
  });
}
