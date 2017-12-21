var margin = {top: 5, right: 80, bottom: 30, left: 50};
var width = 400 - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");

var xLine = d3.scaleTime().range([0, width]);
var yLine = d3.scaleLinear().range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
  // .interpolate("basis")
  .x(function(d) {return xLine(d.date);})
  .y(function(d) {return yLine(d.temperature);});

var svg = d3.select("#line-div").append("svg")
            .attr('id', 'line-svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var coverage_education;
d3.csv('data/coverage-education-linear.csv', function(error, data) {
  data.forEach(function(d) {
    d.Year = parseTime(d.Year);
  });
  this.coverage_education = data;

  if(selected_country) {
    drawLineChart();
  }
});


function drawLineChart() {

  var data = getCountryEducation();
  // console.log(data);

  color.domain(d3.keys(data[0]).filter(function(key) {
    return key !== "Year";
  }));

  var cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {
          date: d.Year,
          temperature: +d[name]
        };
      })
    };
  });

  var variables = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {
          date: d.Year,
          temperature: +d[name]
        };
      })
    };
  });

  xLine.domain(d3.extent(data, function(d) {
    return d.Year;
  }));

  yLine.domain([
    d3.min(cities, function(c) {
      return d3.min(c.values, function(v) {return v.temperature;});
    }),
    d3.max(cities, function(c) {
      return d3.max(c.values, function(v) {return v.temperature;});
    })
  ]);
  // console.log(cities);
  var legend = svg.selectAll('g')
    .data(cities)
    .enter()
      .append('g')
      .attr('class', 'legend');

  legend.append('rect')
    .attr('x', width - 20)
    .attr('y', function(d, i) {
      return i * 20;
    })
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', function(d) {
      return color(d.name);
    });

  legend.append('text')
    .attr('x', width - 8)
    .attr('y', function(d, i) {
      return (i * 20) + 9;
    })
    .text(function(d) {
      return d.name;
    });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xLine));

  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yLine))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentage (%)");

  city = svg.selectAll(".city")
    .data(cities)
    .enter().append("g")
    .attr("class", "city");

  city.append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.values);
    })
    .style("stroke", function(d) {
      return color(d.name);
    });

  city.selectAll(".dot")
        .data(city.filter(function(d) { return d; }))
        .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", line.x())
          .attr("cy", line.y())
          .attr("r", 3.5);

  mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");


  var lines = document.getElementsByClassName('line');

  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(cities)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
      return color(d.name);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
          // console.log(width/mouse[0])
          var xDate = xLine.invert(mouse[0]),
              bisect = d3.bisector(function(d) { return d.date; }).right;
              idx = bisect(d.values, xDate);

          var beginning = 0,
              end = lines[i].getTotalLength(),
              target = null;

          while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0])      end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
          }

          d3.select(this).select('text')
            .text(yLine.invert(pos.y).toFixed(2));

          return "translate(" + mouse[0] + "," + pos.y +")";
        });
    });
}


function removeLineChart(){
   svg.selectAll('g').remove().exit();
}

function updateLineChart() {
  removeLineChart();
  drawLineChart();
}

function getCountryEducation() {
  var result = [];
    // console.log(selected_country);
  coverage_education.forEach(function(d) {
    // console.log(d);
    if ((d.Vaccine == selected_vaccine) && (d.Country_code == selected_country)) {
      // console.log(parseDate(d.Year));
      result.push({'Year': d.Year, 'Coverage': d.Coverage, 'Enrollment': d.Enrollment})
    }
  });
  return result;
}
