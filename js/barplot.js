// import data
var incidence_data;
d3.csv("data/diseases-melt.csv", function (data) {
    this.incidence_data = data;
});

var mapping = {'BCG': ['e_inc_num'],
               'DTP1': ['diphtheria', 'pertussis', 'ttetanus'],
               'DTP3': ['diphtheria', 'pertussis', 'ttetanus'],
               'DTP4': ['diphtheria', 'pertussis', 'ttetanus'],
               'IPV1': ['polio'],
               'HepB_BD': ['hepatitis'],
               'HepB3': ['hepatitis'],
               'Hib3': ['influenza'],
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
               'RCV1': ['rubella', 'CRS'],
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
  var margin = {top: 3, right: 20, bottom: 60, left: 70};
  var width = 800 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
  var y = d3.scaleLinear()
      .range([height, 0]);

  var svg = d3.select("#bar-div").append("svg")
      .attr('id', 'bar-svg')
      .attr("height",height + margin.top + margin.bottom)
      .attr("width",width + margin.left + margin.right)
      .append("g")
      .attr('id', 'g-bar')
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


  // var dataArray = [];
  // var diseasenameArray = [];
  var data = getDiseaseIncidence();
  console.log(data);

  // Scale the range of the data in the domains
  // x.domain(data.map(function (d,i) {return diseasenameArray[i]}));
  // y.domain([0, d3.max(dataArray)]);
  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return parseInt(d.Incidence); })]);

  // var barwidth = (data.length + 1)

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
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html(d.Incidence);
      })
      .on("mouseout", function(d){ tooltip.style("display", "none");})

  // svg.selectAll("text")
  //     .data(data)
  //     .enter().append("text")
  //     .text(function (d) {return d})
  //     .attr('class', 'test')
  //     .attr("transform", "rotate(-90)")
  //     .attr("class", "text")
      // .attr("x", 0 - height)
      // .attr("y", function(d,i) { return i * (width / barwidth) + (barwidth /2);});

  // add the x Axis
  svg.append("g")
      .attr('class', 'x axis bar')
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em");


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
  var ticks = svg.selectAll(".x.axis.bar .tick text");
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
  // call select func to create dropdown and add labels

  //  set selction options
  select_disease.selectAll('option').remove().exit();
  var options_diseases = select_disease
      .selectAll('option')
        .data(diseases).enter()
        .append('option')
        .text(function (d) { return d; });

  selected_disease = d3.select('#disease-select').property('value');
  console.log(selected_disease);

  drawBarChart();
}

// function getCountryIncidence() {
//   var result = [];
//
//   // incidence_data.forEach(function(d){
//   //   // if disease is related to vaccine
//   //   if(diseases.indexOf(d.Dissease) > -1) {
//   //     // if selected country and selected disease
//   //     if (d.Country == selected_country && d.Disease == selected_disease) {
//   //
//   //       }
//   //     }
//   //   };
//   //   // selected_vaccine
//   //   if ((d.Disease == selected_disease) && (d)) {
//   //
//   //   }
//   // });
//   //
//   // data.forEach(function (d) {
//   //     if (d.Country == 'Algeria' && d.Disease == 'diphtheria')
//   //     {dataArray.push(parseInt(d.Incidence))}
//   //     if (d.Country == 'Algeria' && d.Disease == 'diphtheria')
//   //     {diseasenameArray.push(parseInt(d.Year))}
//   // })
// }

// var parseTime = d3.timeParse("%Y");


function getDiseaseIncidence() {
  console.log(selected_disease);
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
 console.log(selected_disease);
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
