fetch("./defaultData.json")
  .then((data) => {
    return data.json();
  })
  .then((response) => {
    response.data.forEach(function (d) {
      d.Place = +d.Place;
      var parsedTime = d.Time.split(":");
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });
    drawPlot(response.data);
  });

function drawPlot(dataset) {
  const width = 1100;
  const height = 516;
  const padding = 40;

  const svg = d3
    .select("#plot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const tooltip = d3
    .select("main")
    .append("div")
    .attr("id", "tooltip")
    .style("width", "250px")
    .style("height", "150px")
    .style("opacity", "0")
    .style("position", "absolute")
    .style("background-color", "#5C469C")
    .style("color", "white")
    .style("padding", "10px")
    .style("border-radius", "10px")
     .style("top", "0px")
    .style("left", "0px");

  const xAxisScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d) => d.Year) - 1,
      d3.max(dataset, (d) => d.Year) + 1,
    ])
    .range([padding, width - padding]);

  const xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(${0}, ${height - padding})`);

  const yAxisScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, (d) => d.Time))
    .range([padding, height - padding]);

  const yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, ${0})`);
  
       d3.select("#plot")
      .append('div')
      .style('transform', 'rotate(90deg)')
      .style('font-size', 18)
      .text('Time in Minutes')
      .attr("fill", "white")
      .style("position", "absolute")
      .style("left", "20px")
      .style("top", "400px")

  svg
    .selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 8)
    .attr("cx", (d) => {
      return xAxisScale(d.Year);
    })
    .attr("cy", (d) => {
      return yAxisScale(d.Time);
    })
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time.toISOString())
    .attr("fill", (d) => {
      if (d.Doping !== "") return "#D4ADFC";
      else return "#5C469C";
    })
    .on("mouseover", (e, d) => tooltipData(e, d))
    .on("mouseout",  ()=>{
      tooltip.style("opacity", "0")
    })
    .attr("stroke", "#000");

  const legendContainer = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${width - 300}, ${height / 2})`);

  legendContainer.attr("width", 20).attr("height", 20);

  legendContainer.append("g").attr("id", "legend-label1");
  legendContainer.append("g").attr("id", "legend-label2");

  svg
    .select("#legend-label1")
    .append("text")
    .text("No doping allegations")
    .attr("dy", "1em")
    .attr("dx", "2em")
    .attr("fill", "white");

  svg
    .select("#legend-label1")
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", "#5C469C");

  svg
    .select("#legend-label2")
    .append("text")
    .text("Riders with doping allegations")
    .attr("dy", "2em")
    .attr("dx", "2em")
    .attr("fill", "white")
  svg
    .select("#legend-label2")
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", "#D4ADFC")
    .attr("x", 0)
    .attr("y", 20);

  function tooltipData(event, d) {
    tooltip
      .html(
        `
        <p>${d.Name}: ${d.Nationality}</p>
        <p>Year: ${
          d.Year
        }, Time: ${d.Time.getMinutes()}:${d.Time.getSeconds()}</p>
        <p>${d.Doping}</p>
      `
      )
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 28 + "px")
      .style("opacity", "0.9")
      .attr("data-year", `${d.Year}`);
  }
}
