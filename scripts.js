var executor = () => {
  consoleLogger('page loaded')
  loadData()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', executor)
} else {
  executor()
}

var consoleLogger = msg => {
  console.log(msg)
}

var chart = data => {
  var svg = d3.select('svg')
  var width = 800
  var height = 500
  var margin = {top: 20, right: 20, bottom: 30, left: 40}

  var formTimeValues = function(timeString) {
    times = timeString.split('-')
    return {
      year: times[0],
      month: times[1],
      day: times[2]
    }
  }
  var startTime = formTimeValues(data[0][0])
  var endTime = formTimeValues(data[data.length - 1][0])

  var x = d3.scaleTime()
    .domain([
      new Date(startTime.year, startTime.month, startTime.day),
      new Date(endTime.year, endTime.month, endTime.day)
    ])
    .range([margin.left, width - margin.right])
  
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d[1] })])
    .range([height - margin.bottom, margin.top])

  var xAxis = function(g) {
    return g.attr('transform', `translate(0, ${height - margin.bottom})`)
            .attr('class', 'tick')
            .call(d3.axisBottom(x))
  }

  var yAxis = function(g) {
    return g.attr('transform', `translate(${margin.left}, 0)`)
            .attr('class', 'tick')
            .call(d3.axisLeft(y))
  }

  var tooltip = d3.select('body').append('div')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  svg.append('g')
    .attr('fill', 'steelblue')
    .selectAll('rect').data(data).enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) {
      var time = formTimeValues(d[0])
      return x(new Date(time.year, time.month, time.day))
    })
    .attr('y', function(d) { return y(d[1]) })
    .attr('height', function(d) { return (y(0) - y(d[1])) })
    .attr('width', '3')
    .attr('data-date', function(d) { return d[0] })
    .attr('data-gdp', function(d) { return d[1] })
    .on('mouseover', function(d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', .9)
        .attr('data-date', d[0])
      tooltip.html('Value: $' + d[1] + 'B' + '<br>' + 'Date: ' + d[0])
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY + 35) + 'px')
    })
    .on('mouseout', function(d) {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })

  svg.append('g')
    .attr('id', 'x-axis')
    .call(xAxis)

  svg.append('g')
    .attr('id', 'y-axis')
    .call(yAxis)
}

var loadData = () => {
  var url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  var req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.send()
  req.onload = () => {
    consoleLogger('data loaded: >>>')
    var data = JSON.parse(req.responseText).data
    consoleLogger(data)
    chart(data)
  }
}
