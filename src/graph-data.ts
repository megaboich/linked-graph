import {Triple} from './triple'

export interface GraphNode {
    id: string;
    group: number;
    x?: number;
    y?: number;
    selected?: boolean;
}

export interface GraphLink {
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
        })

        graph.links = triples.map(t => {
            let link: GraphLink = {
                source: graph.nodes.find(n => n.id == t.subject),
                target: graph.nodes.find(n => n.id == t.object),
                predicate: t.predicate,
                value: 30
            };
            return link;
        });

        return graph;
    }
}