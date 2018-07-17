import * as d3 from "d3";
import { Subject } from "rxjs";
import "../styles/graph.css";

import { GraphData, GraphLink, GraphNode } from "./graph-data";

const nodeRadiusX = 50;
const nodeRadiusY = 25;
const linkLength = 150;

export class GraphRender {
  updateGraph: () => void;
  selectedNodeSubject: Subject<GraphNode>;

  constructor(graph: GraphData, selectedNodeSubject: Subject<GraphNode>) {
    this.selectedNodeSubject = selectedNodeSubject;

    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;

    const svg = d3
      .select("svg" as any)
      .on("click", () => {
        this.selectedNodeSubject.next(undefined);
      })
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 2, 8])
          .on("zoom", () => {
            svg.attr("transform", d3.event.transform);
          })
      )
      .append("g")
      .attr("transform", "translate(40,0)");

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(function(d: any) {
            return d.id;
          })
          .links(graph.links)
          .distance(linkLength)
      )
      .force("charge", d3.forceManyBody().strength(-80))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(nodeRadiusX))
      .nodes(graph.nodes)
      .on("tick", ticked);

    const drag = d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged as any)
      .on("end", dragended as any);

    const click = (node: GraphNode) => {
      d3.event.stopPropagation();
      this.selectedNodeSubject.next(node);
    };

    this.selectedNodeSubject.subscribe(() => {
      // we need to force simulation to update objects
      simulation.restart();
    });

    let link: any = undefined;
    let linkText: any = undefined;
    let line: any = undefined;
    let node: any = undefined;

    this.updateGraph = function update() {
      link = svg
        .selectAll(".link")
        .data
        //simulation.force("link").links(),
        //d => d.source.id + "->" + d.target.id
        ();

      let linkEnter = link
        .enter()
        .append("g")
        .attr("class", "link");

      linkEnter
        .append("text")
        .attr("dy", ".3em")
        .attr("class", "linkText")
        .style("text-anchor", "middle")
        .text((d: GraphLink) => d.predicate);

      linkText = svg.selectAll(".linkText");

      linkEnter.append("line").attr("class", "linkLine");
      line = svg.selectAll(".linkLine");

      link = linkEnter.merge(link);
      link.exit().remove();

      node = svg.selectAll(".node").data(simulation.nodes(), function(d: any) {
        return d.id;
      });

      let nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .on("click", click)
        .call(drag);

      nodeEnter
        .append("ellipse")
        .attr("class", "nodeEllipse")
        .attr("rx", function(d: GraphNode) {
          return nodeRadiusX;
        })
        .attr("ry", function(d: GraphNode) {
          return nodeRadiusY;
        });

      nodeEnter
        .append("text")
        .attr("class", "nodeText")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d: GraphNode) {
          return d.id;
        });

      nodeEnter.append("title").text(function(d: GraphNode) {
        return d.id;
      });

      node = nodeEnter.merge(node);
      node.exit().remove();

      simulation.nodes(graph.nodes);

      //simulation.force("link").links(graph.links);

      // we need to force simulation to update objects
      simulation.restart();
    };

    function ticked() {
      line
        .attr("x1", function(d: GraphLink) {
          return d.source.x;
        })
        .attr("y1", function(d: GraphLink) {
          return d.source.y;
        })
        .attr("x2", function(d: GraphLink) {
          return d.target.x;
        })
        .attr("y2", function(d: GraphLink) {
          return d.target.y;
        });

      linkText
        .attr("x", function(d: GraphLink) {
          return (
            (d.target.x || 0) + ((d.source.x || 0) - (d.target.x || 0)) / 2
          );
        })
        .attr("y", function(d: GraphLink) {
          return (
            (d.target.y || 0) + ((d.source.y || 0) - (d.target.y || 0)) / 2
          );
        });

      node.attr("transform", (d: GraphNode) => `translate(${d.x},${d.y})`);
      node.attr("class", (d: GraphNode) => {
        if (d.selected) {
          return "node selected";
        } else {
          return "node";
        }
      });
    }

    function dragstarted() {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
    }

    function dragged(d: GraphNode) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d: GraphNode) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = undefined;
      d.fy = undefined;
    }

    this.updateGraph();
  }
}
