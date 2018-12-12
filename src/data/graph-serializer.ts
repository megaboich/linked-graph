import { ensure } from "src/helpers/syntax";
import { GraphObject, GraphModel, GraphConnection } from "./graph-model";

interface GraphLink {
  sourceId: string;
  targetId: string;
}

interface SerializedGraphData {
  objects: GraphObject[];
  links: GraphLink[];
}

export function serializeGraph(graph: GraphModel): string {
  // We need to clone nodes to include only data related to serializing and skip all unnecessary WebCola data
  const objectClones = graph.objects.map(x => {
    const node: GraphObject = {
      id: x.id,
      label: x.label,
      x: Math.round(x.x),
      y: Math.round(x.y)
    };
    return node;
  });

  // And instead of putting connection we put a link because we dont want data duplication
  const links = graph.connections.map(x => {
    const link: GraphLink = {
      sourceId: x.source.id,
      targetId: x.target.id
    };
    return link;
  });

  const data: SerializedGraphData = {
    objects: objectClones,
    links
  };

  return JSON.stringify(data);
}

export function deserializeGraph(serializedGraph: string): GraphModel {
  try {
    const { objects, links } = JSON.parse(
      serializedGraph
    ) as SerializedGraphData;
    ensure(objects);
    ensure(links);

    const connections: GraphConnection[] = [];
    for (const link of links) {
      const source = ensure(objects.find(x => x.id === link.sourceId));
      const target = ensure(objects.find(x => x.id === link.targetId));
      connections.push({ source, target });
    }

    return {
      objects,
      connections
    };
  } catch (ex) {
    console.error(ex);
    throw new Error("Error while deserializing graph");
  }
}
