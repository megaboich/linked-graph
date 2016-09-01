import {Triple} from './triple'

export interface GraphNode {
    id: string;
    group: number;
    x?: number;
    y?: number;
}

export interface GraphLink {
    source: string;
    target: string;
    predicate?: string;
    value: number;
}

export class GraphData {
    nodes: GraphNode[] = [];
    links: GraphLink[] = [];
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
        })

        graph.links = triples.map(t => {
            let link: GraphLink = {
                source: t.subject,
                target: t.object,
                predicate: t.predicate,
                value: 30
            };
            return link;
        });

        return graph;
    }
}