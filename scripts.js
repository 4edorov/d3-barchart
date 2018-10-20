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

  x = d3.scaleBand()
    .domain(data.map(function(d) { return d[0] }))
    .range([0, width])
    .padding(0.1)

  y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d[1] })]).nice()
    .range([height, 0])

  svg.append('g')
    .attr('fill', 'blue')
    .selectAll('rect').data(data).enter().append('rect')
    .attr('x', function(d) { return x(d[0]) })
    .attr('y', function(d) { return y(d[1]) })
    .attr('height', function(d) { return (y(0) - y(d[1])) })
    .attr('width', '5')
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
