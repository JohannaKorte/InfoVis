function addSlider() {
  var svg = d3.select("#slider-svg"),
  margin = {right: 15, left: 15},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height");

  years = getYears();

  xSlider = d3.scaleLinear()
      .domain([0, years.length - 1])
      .range([0, width])
      .clamp(true);

  var slider = svg.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

  slider.append("line")
      .attr("class", "track")
      .attr("x1", xSlider.range()[0])
      .attr("x2", xSlider.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() { updateMap(xSlider.invert(d3.event.x)); })
        );

  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 20 + ")")
    .selectAll("text")
    .data(xSlider.ticks(years.length))
    .enter().append("text")
      .attr("x", xSlider)
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
  handle.attr("cx", xSlider(h));

  // get year from slider value
  slider_year = years[Math.round(h)];

  // update map data
  map.column(slider_year).update();

  // update hbar
  updateHBar(slider_year, selected_country);

  // make tickmark text big and bold when year is selected
  d3.selectAll('.slider-tick').nodes().forEach(function(t){

    if (parseInt(t.innerHTML) == slider_year) {
      d3.select(t).style('font-weight', 'bold')
                  .style('font-size', '150%');

    } else {
      d3.select(t).style('font-weight', 'normal')
                  .style('font-size', '100%');
    }
  });
}
