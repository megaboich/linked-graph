import { getRandomNumber } from "src/helpers/random";
import {
  GraphObject,
  GraphConnection,
  GraphModel,
  defaultGraphOptions
} from "./graph-model";
import { getAmsterdamMetroGraphData } from "./sample-data-amsterdam-metro";
import { getCircleGraphData } from "./sample-data-circle";
import { getUrsaMajorGraphData } from "./sample-ursa-major";
import { get2ObjectsGraphData } from "./sample-data-2-objects";

export interface GraphSample {
  name: string;
  getGraph(): GraphModel;
}

function getRandomCoordinates() {
  return {
    x: getRandomNumber(10, 590),
    y: getRandomNumber(10, 590)
  };
}

function buildGraphFromData(
  points: string[],
  links: string[],
  relation: string
): GraphModel {
  const objects = points.map(s => {
    const object: GraphObject = {
      id: s,
      label: s,
      ...getRandomCoordinates()
    };
    return object;
  });

  const connections = links.map(r => {
    const pair = r.split(":");
    const source = objects.find(x => x.id === pair[0]);
    const target = objects.find(x => x.id === pair[1]);
    if (!source) {
      throw new Error("Source is not found for relation: " + r);
    }
    if (!target) {
      throw new Error("Target is not found for relation: " + r);
    }
    const connection: GraphConnection = {
      source,
      target,
      relation
    };
    return connection;
  });

  return { objects, connections, options: defaultGraphOptions };
}

export function getSamples(): GraphSample[] {
  const graphs = [
    getCircleGraphData(),
    get2ObjectsGraphData(),
    getUrsaMajorGraphData(),
    getAmsterdamMetroGraphData()
  ];
  return graphs.map(data => {
    const sample: GraphSample = {
      name: data.name,
      getGraph: () => {
        return buildGraphFromData(data.points, data.links, data.relation);
      }
    };
    return sample;
  });
}
