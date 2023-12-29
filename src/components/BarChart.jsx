import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./../index.css";

const BarChart = (props) => {
  const data = props.data;
  console.log("bar", data);
  const letter = props?.keyword || "letter";
  const chartRef = useRef();

  useEffect(() => {
    const width = 900;
    const height = 500;
    const marginTop = 40; // Increased margin for title
    const marginRight = 0;
    const marginBottom = 100; // Increased margin for x-axis label and scrollable container
    const marginLeft = 70; // Increased margin for y-axis label

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const x = d3
      .scaleBand()
      .domain(data.data.map((d) => d[letter]))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.data, (d) => d.frequency)])
      .nice()
      .range([height - marginBottom, marginTop]);

    const svg = d3
      .select(chartRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;")
      .call(zoom);

    svg
      .append("g")
      .attr("class", "bars")
      .attr("fill", "#6366f1")
      .selectAll("rect")
      .data(data.data)
      .join("rect")
      .attr("x", (d) => x(d[letter]))
      .attr("y", (d) => y(d.frequency))
      .attr("height", (d) => y(0) - y(d.frequency))
      .attr("width", x.bandwidth())
      .on("mouseover", (event, d) => {
        const xValue = d[letter];
        const yValue = d.frequency;
        // console.log("x", xValue, "y", yValue);
        tooltip.transition().duration(200).style("opacity", 0.9);

        tooltip
          .html(`<strong>${xValue}</strong><br/>Frequency: ${yValue}`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // X Axis
    if (props.rotate) {
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", -9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end");
    } else {
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);
    }

    // Title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", marginTop / 2)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text(props.title);

    // X Axis Label
    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height - marginBottom / 3) // Adjusted position for better spacing
      .style("text-anchor", "middle")
      .text(props.xlabel);

    // Y Axis Label
    // Y Axis
svg
.append("g")
.attr("class", "y-axis")
.attr("transform", `translate(${marginLeft},0)`)
.call(d3.axisLeft(y))
.call(g => g.select(".domain").remove());
    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", marginLeft / 3) // Adjusted position for better spacing
      .style("text-anchor", "middle")
      .text(props.ylabel);

    function zoom(svg) {
      const extent = [
        [marginLeft, marginTop],
        [width - marginRight, height - marginTop],
      ];

      svg.call(
        d3
          .zoom()
          .scaleExtent([1, 8])
          .translateExtent(extent)
          .extent(extent)
          .on("zoom", zoomed)
      );

      function zoomed(event) {
        x.range(
          [marginLeft, width - marginRight].map((d) =>
            event.transform.applyX(d)
          )
        );
        svg
          .selectAll(".bars rect")
          .attr("x", (d) => x(d[letter]))
          .attr("width", x.bandwidth());
        svg.selectAll(".x-axis").call(xAxis);
      }
    }
  }, [data]);

  return <svg ref={chartRef} />;
};

export default BarChart;
