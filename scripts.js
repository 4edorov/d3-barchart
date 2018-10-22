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
  var margin = {top: 20, right: 0, bottom: 30, left: 40}

  var x = d3.scaleBand()
    .domain([new Date(1950, 0, 1), new Date(2015, 0, 1)])
    .range([margin.left, width - margin.right])
    .padding(0.1)
  
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

  svg.append('g')
    .attr('fill', 'steelblue')
    .selectAll('rect').data(data).enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) { return x(d[0]) })
    .attr('y', function(d) { return y(d[1]) })
    .attr('height', function(d) { return (y(0) - y(d[1])) })
    .attr('width', '3')
    .attr('data-date', function(d) { return d[0] })
    .attr('data-gdp', function(d) { return d[1] })
    .append('title')
    .text(function(d) { return d })

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
