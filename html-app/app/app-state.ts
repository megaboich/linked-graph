import { GraphData, GraphNode, GraphDataBuilder } from './graph-data'
import { Subject } from 'rxjs/Subject';
import { Triple } from './triple'

export class ApplicationState {
    graph: GraphData = new GraphData();
    graphUpdatedSubject = new Subject<GraphData>();
    selectedNodeSubject = new Subject<GraphNode>();

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

    appendTriplesToGraph(triples: Triple[]) {
        let newData = GraphDataBuilder.BuildGraphData(triples);
        newData.nodes.forEach(n => this.graph.nodes.push(n));
        newData.links.forEach(l => this.graph.links.push(l));
        this.updateGraph();
    }
}