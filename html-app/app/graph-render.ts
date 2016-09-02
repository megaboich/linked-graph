import * as d3 from 'd3'
import {GraphData, GraphLink, GraphNode} from './graph-data'
import '../styles/graph.css'

import { Subject } from 'rxjs/Subject';

export class GraphRender {
    updateGraph: () => void;

    selectedNodeSubject = new Subject<GraphNode>();

    constructor(graph: GraphData) {
        const nodeRadiusX = 50;
        const nodeRadiusY = 25;
        const linkLength = 150;

        let svg = d3.select("svg"),
            width = 700,
            height = 700;

        let node,
            link,
            linkText,
            line;

        let simulation = d3.forceSimulation()
            .force("link", d3.forceLink()
                .id(function (d) { return d.id; })
                .distance(linkLength))
            .force("charge", d3.forceManyBody().strength(-80))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide(nodeRadiusX))
            .on("tick", ticked);

        let drag = d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        let click = (node, index) => {
            this.selectedNodeSubject.next(node);
        };

        this.selectedNodeSubject.subscribe(node => {
            graph.nodes.forEach(n => n.selected = false);
            node.selected = true;
        })

        this.updateGraph = function update() {

            link = svg.selectAll(".link")
                .data(graph.links, d => d.source.id + "->" + d.target.id);

            let linkEnter = link.enter().append("g")
                .attr("class", "link");

            linkEnter.append("text")
                .attr("dy", ".3em")
                .attr("class", "linkText")
                .style("text-anchor", "middle")
                .text(d => d.predicate);

            linkText = svg.selectAll(".linkText")

            linkEnter.append("line").attr("class", "linkLine");
            line = svg.selectAll(".linkLine");

            link = linkEnter.merge(link);

            node = svg.selectAll(".node")
                .data(graph.nodes, function (d) { return d.id; })

            let nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .on("click", click)
                .call(drag);

            nodeEnter.append("ellipse")
                .attr("class", "nodeEllipse")
                .attr("rx", function (d) { return nodeRadiusX; })
                .attr("ry", function (d) { return nodeRadiusY; });

            nodeEnter.append("text")
                .attr("class", "nodeText")
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .text(d => d.id);

            nodeEnter.append("title")
                .text(function (d) { return d.id; });

            node = nodeEnter.merge(node);

            simulation
                .nodes(graph.nodes);

            simulation.force("link")
                .links(graph.links);

            simulation.restart();
        }

        function ticked() {
            line.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            linkText.attr("x", function (d) { return d.target.x + (d.source.x - d.target.x) / 2; })
                .attr("y", function (d) { return d.target.y + (d.source.y - d.target.y) / 2; })

            node.attr("transform", d => `translate(${d.x},${d.y})`);
            node.attr("class", d => {
                if (d.selected) {
                    return "node selected";
                }
                else {
                    return "node";
                }
            });
        }

        function dragstarted(d) {
            if (!d3.event.active) { simulation.alphaTarget(0.3).restart() }
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) { simulation.alphaTarget(0); }
            d.fx = undefined;
            d.fy = undefined;
        }

        this.updateGraph();
    }
}