var categories= ['', 'VAD1', 'TT2plus', 'MenA', 'YFV', 'PAB', 'HepB_BD', 'rotac', 'MCV2',
                 'IPV1', 'PCV3', 'JapEnc', 'DTP4', 'Rota1', 'PCV2', 'MCV1', 'HepB3',
                 'Pol3', 'Hib3', 'DTP3', 'BCG', 'PCV1', 'RCV1', 'DTP1'];

// var dollars = [213,209,190,179,156,209,190,179,213,209,190,179,156,209,190,190];
var mean_coverage_2016 = [ 66.73214286,  69.27358491,  69.5       ,  75.10810811,
                           77.06896552,  80.275     ,  80.79518072,  81.66216216,
                           81.72058824,  83.008     ,  84.36363636,  84.79439252,
                           86.3375    ,  86.62184874,  88.47802198,  88.95953757,
                           89.23243243,  89.57062147,  89.61413043,  89.82467532,
                           90.48245614,  91.27131783,  93.07692308]

var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B',
              '#285964','#405F83','#416545','#4D7069','#6E9985','#7EBC89','#0283AF',
              '#79BCBF','#99C19E', '#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE',
              '#074285','#00187B'];

var width = 200;
var height = 700;
var grid = d3.range(10).map(function(i){
	return {'x1':0,'y1':0,'x2':0,'y2':480};
});

var tickVals = grid.map(function(d,i){
	if(i>0){ return i*10; }
	else if(i===0){ return "100";}
});

var xscale = d3.scaleLinear()
				.domain([0,100])
				.range([0,width]);

var yscale = d3.scaleLinear()
				.domain([0,categories.length])
				.range([0,height]);

var colorScale = d3.scale.quantize()
				.domain([0,categories.length])
				.range(colors);

var canvas = d3.select('#wrapper')
console.log(canvas)
canvas
		.append('svg')
    .attr('id', 'wrapper-svg')
		.attr({'width':width + 20 ,'height':height + 20});

// var grids = canvas.append('g')
// 				  .attr('id','grid')
// 				  .attr('transform','translate(150,10)')
// 				  .selectAll('line')
// 				  .data(grid)
// 				  .enter()
// 				  .append('line')
// 				  .attr({'x1':function(d,i){ return i*30; },
// 						 'y1':function(d){ return d.y1; },
// 						 'x2':function(d,i){ return i*30; },
// 						 'y2':function(d){ return d.y2; },
// 					})
// 				  .style({'stroke':'#adadad','stroke-width':'1px'});

var	xAxis = d3.svg.axis();
	xAxis
		.orient('bottom')
		.scale(xscale)
		.tickValues(tickVals);

var	yAxis = d3.svg.axis();
	yAxis
		.orient('left')
		.scale(yscale)
		.tickSize(2)
		.tickFormat(function(d,i){ return categories[i]; })
		.tickValues(d3.range(categories.length));

var y_xis = canvas.append('g')
				  .attr("transform", "translate(150,0)")
				  .attr('id','yaxis')
				  .call(yAxis);

var x_xis = canvas.append('g')
				  .attr("transform", "translate(150,480)")
				  .attr('id','xaxis')
				  .call(xAxis);

var chart = canvas.append('g')
					.attr("transform", "translate(150,0)")
					.attr('id','bars')
					.selectAll('rect')
					.data(mean_coverage_2016)
					.enter()
					.append('rect')
					.attr('height',19)
					.attr({'x':0,'y':function(d,i){ return yscale(i)+19; }})
					.style('fill',function(d,i){ return colorScale(i); })
					.attr('width',function(d){ return 0; });


var transit = d3.select("svg").selectAll("rect")
				    .data(mean_coverage_2016)
				    .transition()
				    .duration(1000)
				    .attr("width", function(d) {return xscale(d); });

var transitext = d3.select('#bars')
					.selectAll('text')
					.data(mean_coverage_2016)
					.enter()
					.append('text')
					.attr({'x':function(d) {return xscale(d)-200; },'y':function(d,i){ return yscale(i)+35; }})
					.text(function(d){ return Math.round(d,2) + '%'; }).style({'fill':'#fff','font-size':'14px'});
