// https://observablehq.com/@mbostock/walmarts-growth@333
import define1 from "./450051d7f1174df8@254.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["walmart.tsv",new URL("./files/ref_data",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# NSF Awards for Bioplastic Research

This animation shows the history of grants awarded for bioplastic research.`
)});
  main.variable(observer("viewof date")).define("viewof date", ["Scrubber","d3","data"], function(Scrubber,d3,data){return(
Scrubber(d3.utcWeek.every(2).range(...d3.extent(data, d => d.date)), {format: d3.utcFormat("%Y %b %-d"), loop: false})
)});
  main.variable(observer("date")).define("date", ["Generators", "viewof date"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","topojson","us","data"], function(d3,topojson,us,data)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, 960, 600]);

  svg.append("path")
      .datum(topojson.merge(us, us.objects.lower48.geometries))
      .attr("fill", "#ddd")
      .attr("d", d3.geoPath());

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.lower48, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", d3.geoPath());

  const g = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "black");

  const dot = g.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("transform", d => `translate(${d})`);

  svg.append("circle")
      .attr("fill", "blue")
      .attr("transform", `translate(${data[0]})`)
      .attr("r", 3);

  let previousDate = -Infinity;

  return Object.assign(svg.node(), {
    update(date) {
      dot // enter
        .filter(d => d.date > previousDate && d.date <= date)
        .transition().attr("r", 3);
      dot // exit
        .filter(d => d.date <= previousDate && d.date > date)
        .transition().attr("r", 0);
      previousDate = date;
    }
  });
}
);
  main.variable(observer("update")).define("update", ["chart","date"], function(chart,date){return(
chart.update(date)
)});
  main.variable(observer("data")).define("data", ["FileAttachment","projection","parseDate"], async function(FileAttachment,projection,parseDate){return(
(await FileAttachment("walmart.tsv").tsv())
  .map(d => {
    const p = projection(d);
    p.date = parseDate(d.date);
    return p;
  })
  .sort((a, b) => a.date - b.date)
)});
  main.variable(observer("parseDate")).define("parseDate", ["d3"], function(d3){return(
d3.utcParse("%m/%d/%Y")
)});
  main.variable(observer("projection")).define("projection", ["d3"], function(d3){return(
d3.geoAlbersUsa().scale(1280).translate([480, 300])
)});
  main.variable(observer("us")).define("us", ["d3"], async function(d3)
{
  const us = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@1/us/10m.json");
  us.objects.lower48 = {
    type: "GeometryCollection",
    geometries: us.objects.states.geometries.filter(d => d.id !== "02" && d.id !== "15")
  };
  return us;
}
);
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  return main;
}
