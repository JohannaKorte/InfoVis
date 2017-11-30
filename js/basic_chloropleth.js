//  draw map
var map = d3.geomap.choropleth()
    .geofile('d3-geomap/topojson/world/countries.json')
    .colors(colorbrewer.YlGnBu[9])
    .column('2016')
    .legend(true)
    .unitId('ISO_code');


d3.csv('data/vaccinaties.csv', function(error, data) {
    this.data = data;
    // get unique vaccine names
    var labels = getLabels();

    // call select func to create dropdown and add labels
    var select = d3.select('#dropdown')
      .append('select')
      	.attr('class','select')
        .on('change', onchange);

    var options = select
      .selectAll('option')
    	.data(labels).enter()
    	.append('option')
    	.text(function (d) { return d; });

    // get selection
    selected = d3.select('select').property('value')

    // get data for selected Vaccine
    var data_vaccine = getData(selected);
    // add data to map and draw
    d3.select('#map')
        .datum(data_vaccine)
        .call(map.draw, map);
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
}

function onchange() {
  // get selected value
	selected = d3.select('select').property('value');

  // get data for selected Vaccine
  var data_vaccine = getData(selected);

  // set map data to selected
  map.data = data_vaccine;

  // update map
  map.update()

};
