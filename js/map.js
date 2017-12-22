// NOTE: By declaring a variable without 'var', makes it a global variable

var map = d3.geomap.choropleth()
    .geofile('d3-geomap/topojson/world/countries.json')
    .colors(colorbrewer.YlGnBu[8])
    .width('800')
    .height('400')
    .legend(true)
    .scale(140)
    .unitId('ISO_code')
    .format(function(d){return d3.format(",.0%")(d/100)})
    .postUpdate(handleCountrySelection);


d3.csv('data/vaccines.csv', function(error, data) {
    // set data to global
    this.data = data;

    vaccines = getLabels(); // get unique vaccine names
    years = getYears();     // get years

    // set defaults
    selected_vaccine = 'BCG';  //since it has a nice variation over the years
    selected_country = null;
    // update vaccine display (right corner)
    updateDisplay();
    // get data for selected Vaccine and update selected year
    var data_vaccine = getMapData();

    // add data to map and draw
    d3.select('#map')
        .datum(data_vaccine)
        .call(map.draw, map);

    // add slider
    addSlider();
});

function getMapData() {
  var result = [];
  data.forEach(function(d) {
    if(d.Vaccine == selected_vaccine) {
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


function handleCountrySelection() {
  // select all units (countries)
  var units = d3.select('#map').selectAll('.unit')
  // when clicked on a unit
  units
    .on("click", function(d){
      selected_country = d.id;
      selected_country_name = d.properties.name;

      // make all units transparent
      units
          .style("stroke-width", 0.4)
          .style('stroke', 'black')
          .style('opacity', 0.6)
      // except the unit clicked on
      d3.select(this)
          .style("stroke-width", 0.5)
          .style('stroke', 'white')
          .style('opacity', 1);

      // remove placeholder text
      d3.selectAll('p').style('display', 'none');

      // update horizontal bar
      updateHBar(slider_year, selected_country);

      // update line chart
      updateLineChart();

      // show barchart
      updateBarChart();

      // update text display
      updateDisplay();
    });

  // select the sea area (rectangle) on the map
  var sea = d3.select('rect.background')
  // when clicked on the sea
  sea
    .on('click', function(d) {
        selected_country = null;
        selected_country_name = null;

        // remove transparancies of all units
        units
          .style("stroke-width", 0.5)
          .style('stroke', 'black')
          .style('opacity', 1);

        // set placeholder
        d3.select('#bar-placeholder').html('[Select a Country]');
        d3.selectAll('p').style('display', 'inline-block');

        // update horizontal bar
        updateHBar(slider_year, null);

        // remove linechart
        removeLineChart();

        //  remove barchart
        removeBarChart();

        // update text display
        updateDisplay();

      });
}
