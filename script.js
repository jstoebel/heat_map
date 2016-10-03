d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(data){

  var monthlies = data.monthlyVariance

  var margin = { top: 30, right: 30, bottom: 70, left:70 }

  var colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];

  var vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 200;
  var vpHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100 ;

  var height = vpHeight - margin.top - margin.bottom,
      width = vpWidth - margin.left - margin.right

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"];

  // var yScale = d3.scale.linear()
  //         .domain([0, 11])
  //         .range([0, height])

  var yScale = function(month){
    //month: integer (0-11)
    return month * (height/12)
  }

  var boxHeight = height / 12

  var years = monthlies.map(function(val, i){
    return val.year
  })

  years = years.filter(function(val, i) {
    // filter out repeats
    return years.indexOf(val) == i;
  });

  var startYear = d3.min(years);
  var endYear = d3.max(years);

  var xScale = d3.time.scale()
          .domain([new Date(startYear,0), new Date(endYear, 0)])
          .range([0, width])

  var tempVars = monthlies.map(function(val, idx){
    return val.variance
  });
  var baseTemp = data.baseTemperature

  var colorScale = d3.scale.quantile()
    .domain([d3.min(tempVars) + baseTemp, d3.max(tempVars) + baseTemp])
    .range(colors);

  var myChart = d3.select("#chart").append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .selectAll('rect').data(monthlies)
        .enter().append('rect')
          .style('fill', function(point, i){
            return colorScale(point.variance + baseTemp)
          })
          .attr('x', function(point, i){
            return xScale(new Date(point.year,0))
          })
          .attr('y', function(point, i){
            return yScale(point.month-1)
          })
          .attr('width', width/(endYear - startYear))
          .attr('height', boxHeight)

          .on('mouseenter', function(d) {
              tooltip.transition()
              .duration(100)
              .style('opacity', .8)

              var ttStr = `<div>${months[d.month-1]}, ${d.year}: ${d.variance}</div>`

              tooltip.html(ttStr)
                  .style('left', (d3.event.pageX - 35) + 'px')
                  .style('top',  (d3.event.pageY - 30) + 'px')
          })

          .on('mouseout', function(d) {

            console.log("Mouseout: "+`${months[d.month-1]}, ${d.year}`)

            tooltip.transition()
              .duration(200)
              .style("opacity", 0);
          })

  var vGuideScale = d3.scale.ordinal()
          .domain(months)
          .range(d3.range(0, height + boxHeight, height/12))

  var vAxis = d3.svg.axis()
      .scale(vGuideScale)
      .orient('left')
      .ticks(12)

  var vGuide = d3.select('svg').append('g')
      vAxis(vGuide)
      vGuide.attr('transform', 'translate(' + margin.left + ', ' + (margin.top + (boxHeight/2)) + ')')
      vGuide.selectAll('path')
          .style('visibility', 'hidden')
      vGuide.selectAll('line')
          .style('visibility', 'hidden')

  var hGuideScale = d3.scale.linear()
          .domain([startYear, endYear])
          .range([0, width])

  var hAxis = d3.svg.axis()
      .orient("bottom")
      .scale(xScale)
      .ticks(d3.time.years, 20);

  var hGuide = d3.select('svg').append('g')
      hAxis(hGuide)
      hGuide.attr('transform', 'translate(' + (margin.left) + ', ' + (height + margin.top) + ')')
      hGuide.selectAll('path')
          .style({ fill: 'none', stroke: "#000"})
      hGuide.selectAll('line')
          .style({ stroke: "#000"})

  var tooltip = d3.select('#chart').insert("div", ":first-child")
    .classed('tooltip',  true)

})
