// <script>


// HTML
var data = [30, 86, 168, 281, 303, 365];

d3.select(".chart")
  .selectAll("div")
  .data(data)
    .enter()
    .append("div")
    .style("width", function(d) { return d + "px"; })
    .text(function(d) { return d; });

// import data
// d3.csv('data/vaccinaties.csv', function(data) {
//           console.log(data[0]);
//         });

// d3.select('g').text('Hello World');
// </script>
