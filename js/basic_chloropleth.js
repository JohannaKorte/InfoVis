var map = d3.geomap.choropleth()
    .geofile('d3-geomap/topojson/world/countries.json')
    .colors(colorbrewer.YlGnBu[9])
    .column('2016')
    .legend(true)
    .unitId('ISO_code');

d3.csv('data/vaccinaties.csv', function(error, data) {
    // add data to map and draw
    d3.select('#map')
        .datum(data)
        .call(map.draw, map);
});
