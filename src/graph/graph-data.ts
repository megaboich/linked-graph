import * as d3 from "d3";
import { Triple } from "../triple";

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  x?: number;
  y?: number;
  selected?: boolean;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: GraphNode;
  target: GraphNode;
  predicate?: string;
  value: number;
}

export class GraphData {
  nodes: GraphNode[] = [];
  links: GraphLink[] = [];

  getLinkKey(link: GraphLink): string {
    return `${link.source.id}->${link.predicate}->${link.target.id}`;
  }
}

export class GraphDataBuilder {
  public static BuildGraphData(triples: Triple[]): GraphData {
    let graph = new GraphData();
    let nodeNames = new Set<string>();
    triples.forEach(t => nodeNames.add(t.object));
    triples.forEach(t => nodeNames.add(t.subject));

    graph.nodes = [];
    nodeNames.forEach(name => {
      graph.nodes.push({ id: name, group: 1 });
    });

    graph.links = triples.map(t => {
      const sourceObj = graph.nodes.find(n => n.id == t.subject);
      if (!sourceObj) {
        throw new Error("Source cannot be resolved: " + t.subject);
      }
      const targetObj = graph.nodes.find(n => n.id == t.object);
      if (!targetObj) {
        throw new Error("Target cannot be resolved: " + t.object);
      }
      const link: GraphLink = {
        source: sourceObj,
        target: targetObj,
        predicate: t.predicate,
        value: 30
      };
      return link;
    });

    return graph;
  }
}
