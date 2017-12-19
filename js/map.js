// NOTE: By declaring a variable without 'var', makes it a global variable

var map = d3.geomap.choropleth()
    .geofile('d3-geomap/topojson/world/countries.json')
    .colors(colorbrewer.YlGnBu[9])
    .width('800')
    .scale(150)
    .legend(true)
    .unitId('ISO_code')
    .zoomFactor(3)
    .postUpdate(handleCountrySelection);

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
    selected_vaccine = null;
    selected_country = null;

    // get data for selected Vaccine and update selected year
    var data_vaccine = getData(selected_vaccine);

    // add data to map and draw
    d3.select('#map')
        .datum(data_vaccine)
        .call(map.draw, map);

    // add Slider
    addSlider();
    //
    // var units = d3.selectAll('.unit')
    // // console.log(d3.select('#map'));
    // units.on('click', function(d){ console.log(d); console.log(this) });
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

  // console.log(selected_vaccine)
  // set new map data
  map.data = getData(selected_vaccine);
  // update map
  map.update()
};


function handleCountrySelection() {
  // select all units (countries)
  var units = d3.select('#map').selectAll('.unit')

  // when clicked on a unit
  units
    .on("click", function(d){
      selected_country = d.properties.name;
      // make all units transparent
      units
          .style("stroke-width", 0.4)
          .style('opacity', 0.5)
      // except the unit clicked on
      d3.select(this)
          .style("stroke-width", 0.5)
          .style('opacity', 1);

      // var selected_country = d.properties.name;
      updateHBar(slider_year, selected_country);
      // // update horizontal bar
      // updateHBar(slider_year, selected_country);
    });

  // select the sea area (rectangle) on the map
  var sea = d3.select('rect.background')

  // when clicked on the sea
  sea
    .on('click', function(d) {
        selected_country = null;
        // remove transparancies of all units
        units
          .style("stroke-width", 0.5)
          .style('opacity', 1);

        updateHBar(slider_year, null);
      });
}