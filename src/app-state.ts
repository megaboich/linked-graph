import { Subject } from "rxjs";
import {
  GraphData,
  GraphNode,
  GraphLink,
  GraphDataBuilder
} from "./graph/graph-data";
import { Triple } from "./triple";

export class ApplicationState {
  graph: GraphData = new GraphData();
  graphUpdatedSubject = new Subject<GraphData>();
  selectedNodeSubject = new Subject<GraphNode>();
  showConnectModalSubject = new Subject<boolean>();

  constructor() {
    this.selectedNodeSubject.subscribe((node: GraphNode) => {
      this.graph.nodes.forEach(n => (n.selected = false));
      if (node) {
        node.selected = true;
      }
    });
  }

  updateGraph() {
    this.graphUpdatedSubject.next(this.graph);
  }

  selectNode(node: GraphNode) {
    this.selectedNodeSubject.next(node);
  }

  addNode(nodeName: string) {
    let newNode: GraphNode = { id: nodeName, group: 1, x: 300, y: 300 };
    this.graph.nodes.push(newNode);
    this.selectNode(newNode);
    this.updateGraph();
  }

  addLink(newLink: GraphLink) {
    this.graph.links.push(newLink);
    this.updateGraph();
  }

  appendTriplesToGraph(triples: Triple[]) {
    let newData = GraphDataBuilder.BuildGraphData(triples);
    newData.nodes.forEach(n => this.graph.nodes.push(n));
    newData.links.forEach(l => this.graph.links.push(l));
    this.updateGraph();
  }

  getConnectionsForNode(node: GraphNode): GraphLink[] {
    if (!node) {
      return [];
    }
    const links = this.graph.links.filter(l => {
      return l.source.id == node.id || l.target.id == node.id;
    });
    return links;
  }
}
