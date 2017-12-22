// import data
var incidence_data;
d3.csv("data/diseases-melt.csv", function (data) {
    this.incidence_data = data;
});

var mapping = {'BCG': ['tuberculosis'],
               'DTP1': ['diphtheria', 'pertussis', 'ttetanus'],
               'DTP3': ['diphtheria', 'pertussis', 'ttetanus'],
               'DTP4': ['diphtheria', 'pertussis', 'ttetanus'],
               'IPV1': ['polio'],
               'HepB_BD': ['hepatitis'],
               'HepB3': ['hepatitis'],
               'Hib3': ['meningitis, pneumonea'],
               'JapEnc': ['JapEnc'],
               'MCV1': ['measles'],
               'MCV2': ['measles'],
               'MenA': ['meningitis'],
               'PCV1': ['streptococcus pneumoniae'],
               'PCV2': ['streptococcus pneumoniae'],
               'PCV3': ['streptococcus pneumoniae'],
               'Pol3': ['polio'],
               'Rota1': ['rotavirus'],
               'rotac': ['rotavirus'],
               'RCV1': ['CRS', 'rubella'],
               'TT2plus': ['ntetanus'],
               'PAB': ['ntetanus'],
               'VAD1': ['vitamine A'],
               'YFV': ['yfever']
              }

var select_disease = d3.select('#dropdown')
                          .append('select')
                            .attr('class','select')
                            .attr('id','disease-select')
                            .on('change', function(d) { handleDiseaseSelection(d)});

function drawBarChart() {
  // set the dimensions and margins of the graph
  var margin = {top: 40, right: 20, bottom: 30, left: 90};
  var width = 800 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  var svg = d3.select("#bar-div").append("svg")
      .attr('id', 'bar-svg')
      .attr("height",height + margin.top + margin.bottom)
      .attr("width",width + margin.left + margin.right)
      .append("g")
      .attr('id', 'g-bar')
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  var data = getDiseaseIncidence();

  // set placeholder if data is unknown
  if (data.length === 0) {
    d3.select('#bar-placeholder')
          .style('display', 'inline-block')
          .html('[Data is Unknown]');
  } else {
    d3.select('#bar-placeholder').style('display', 'none');
  }

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return parseInt(d.Incidence); })]);

  svg.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("height", function(d) { return height - y(d.Incidence); })
      .attr("width", x.bandwidth())
      .attr("x", function(d) { return x(d.Year)})
      .attr("y", function(d) { return y(d.Incidence); })
      .on("mouseover", function(d){
          tooltip
            .style("left", d3.event.pageX - 40 + "px")
            .style("top", d3.event.pageY - 60 + "px")
            .style("display", "inline-block")
            .html(d.Incidence);
      })
      .on("mouseout", function(d){ tooltip.style("display", "none");})


  // add the x Axis
  svg.append("g")
      .attr('id', 'x-axis-bar')
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

  svg.selectAll("text")
            .style("text-anchor", "middle")
            .attr("dx", ".8em")
            .attr("dy", "0.71em");


  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr('x', 0-(height / 2))
      .attr('y', 15-(margin.left) )
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Incidence");

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // Only show axis tick labels every 5 years
  var ticks = svg.selectAll("#x-axis-bar .tick text");
  ticks.attr("class", function(d,i){
      if(i%5 != 0) d3.select(this).remove();
  });
}

function removeBarChart() {
  d3.select('#bar-svg').remove().exit();
}

function updateBarChart() {
  removeBarChart();

  // update dropdown list of diseases
  var diseases = mapping[selected_vaccine];

  //  set selction options
  select_disease.selectAll('option').remove().exit();
  var options_diseases = select_disease
      .selectAll('option')
        .data(diseases).enter()
        .append('option')
        .text(function (d) { return d; });

  selected_disease = d3.select('#disease-select').property('value');

  drawBarChart();
}


function getDiseaseIncidence() {
  var result = [];
  incidence_data.forEach(function(d){
    // if selected country and selected disease
    if((d.Disease == selected_disease) && (d.Country_code == selected_country)) {
      result.push({'Year': d.Year, 'Incidence': parseInt(d.Incidence)})
    };
  });
  return result;
}

function handleDiseaseSelection() {
 selected_disease = d3.select('#disease-select').property('value');
 removeBarChart();
 drawBarChart();

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
