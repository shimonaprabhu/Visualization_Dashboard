function drawSun(width, height) {
  width = 600;
  height = 400;
  var radius = (Math.min(width, height) / 2) - 10;

var formatNumber = d3.format(",d");

var x = d3.scaleLinear()
  .range([0, 2 * Math.PI]);

var y = d3.scaleSqrt()
  .range([0, radius]);

var color = d3.scaleOrdinal(d3.schemeCategory20);



var partition = d3.partition();

var arc = d3.arc()
  .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
  .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
  .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
  .outerRadius(function(d) { return Math.max(0, y(d.y1)); });

var svg = d3.select("#sun").append("svg")
  .attr("width", width)
  .attr("height", height)
.append("g")
  .attr("transform", "translate(" + width / 3 + "," + (height / 2) + ")");

  svg.append("text")
  .attr("x", width / 2)
  .attr("y", "1em")
  .attr("font-size", "1.5em")
  .style("text-anchor", "middle")
  .classed("sun-title", true);

d3.json("./data/co2_sun.json", function(error, root) {

root = d3.hierarchy(root);
root.sum(function(d) { return d.size; });
svg.selectAll("path")
    .data(partition(root).descendants())
  .enter().append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
    .on("click", click)
    .append("title")
    
    .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${formatNumber(d.value)}`);
});


function click(d) {
svg.transition()
    .duration(750)
    .tween("scale", function() {
      var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]),
          yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
      return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
    })
  .selectAll("path")
    .attrTween("d", function(d) { return function() { return arc(d); }; });
}

d3.select(self.frameElement).style("height", height + "px");

var sunTitle = "Hello";

d3.select(".sun-title")
        .text(sunTitle);
}