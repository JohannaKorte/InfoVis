d3.csv("data/diseases-melt.csv", function (data) {
    var dataArray = [];
    var diseasenameArray = [];

    data.forEach(function (d) {
        if (d.Country == 'Algeria' && d.Disease == 'diphtheria')
        {dataArray.push(parseInt(d.Incidence))}
        if (d.Country == 'Algeria' && d.Disease == 'diphtheria')
        {diseasenameArray.push(parseInt(d.Year))}
    })

    // set the dimensions and margins of the graph
    var margin = {top: 3, right: 20, bottom: 60, left: 70},
         width = 800 - margin.left - margin.right,
         height = 140 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var svg = d3.select("#bar-div").append("svg")
        .attr("height",height + margin.top + margin.bottom)
        .attr("width",width + margin.left + margin.right)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(data.map(function (d,i) {return diseasenameArray[i]}));
    y.domain([0, d3.max(dataArray)]);

    var barwidth = (dataArray.length + 1)

    svg.selectAll("rect")
        .data(dataArray)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("height", function(d) { return height - y(d); })
        .attr("width", (width / (dataArray.length + 1)) -1)
        .attr("x", function(d,i) { return i * (width / barwidth);})
        .attr("y", function(d) { return y(d); });

    svg.selectAll("text")
        .data(dataArray)
        .enter().append("text")
        .text(function (d) {return d})
        .attr('class', 'test')
        .attr("transform", "rotate(-90)")
        .attr("class", "text")
        .attr("x", 0 - height)
        .attr("y", function(d,i) { return i * (width / barwidth) + (barwidth /2);});

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add x Axis label
    svg.append("text")      // text label for the x axis
        .attr("x", width/2 )
        .attr("y", height + 40 )
        .style("text-anchor", "middle")
        .text("Year");

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
    var ticks = d3.selectAll(".tick text");
    ticks.attr("class", function(d,i){
        if(i%5 != 0) d3.select(this).remove();
    });
});


