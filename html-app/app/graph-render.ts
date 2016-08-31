import * as d3 from 'd3'
import {GraphData} from './graph-data'
import '../styles/graph.css'

export class GraphRender {
    public static RenderGraph(graph: GraphData) {
        const nodeRadiusX = 50;
        const nodeRadiusY = 25;
        const linkLength = 150;

        let svg = d3.select("svg"),
            width = 700,
            height = 700;

        let link = svg.selectAll(".link")
            .data(graph.links, d => d)
            .enter().append("g")
            .attr("class", "link")

        let linkText = link.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(d => d.predicate);

        let line = link.append("line");

        link.exit().remove();

        let node = svg.selectAll(".node")
            .data(graph.nodes, d => d)
            .enter().append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("ellipse")
            .attr("rx", function (d) { return nodeRadiusX; })
            .attr("ry", function (d) { return nodeRadiusY; })
            .style("fill", function (d) { return "#ffffff" });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(d => d.id);

        node.exit().remove();

        let simulation = d3.forceSimulation()
            .force("link", d3.forceLink()
                .id(function (d) { return d.id; })
                .distance(linkLength))
            .force("charge", d3.forceManyBody().strength(-80))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide(nodeRadiusX));

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            line.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            linkText.attr("x", function (d) { return d.target.x + (d.source.x - d.target.x) / 2; })
                .attr("y", function (d) { return d.target.y + (d.source.y - d.target.y) / 2; })

            node.attr("transform", d => `translate(${d.x},${d.y})`);
        }

        function dragstarted(d) {
            if (!d3.event.active) { simulation.alphaTarget(0.3).restart() };
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) { simulation.alphaTarget(0) };
            d.fx = null;
            d.fy = null;
        }
    }
}