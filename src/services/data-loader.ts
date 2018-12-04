import { getRandomNumber } from "src/helpers/random";
import { GraphObject, GraphConnection } from "src/services/graph-model";

function getRandomCoordinates() {
  return {
    x: getRandomNumber(10, 590),
    y: getRandomNumber(10, 590)
  };
}

export function getInitialGraph() {
  const objects: GraphObject[] = [
    { id: "W", ...getRandomCoordinates() },
    { id: "E", ...getRandomCoordinates() },
    { id: "B", ...getRandomCoordinates() },
    { id: "C", ...getRandomCoordinates() },
    { id: "O", ...getRandomCoordinates() },
    { id: "L", ...getRandomCoordinates() },
    { id: "A", ...getRandomCoordinates() }
  ];

  const connections: GraphConnection[] = [
    { source: objects[0], target: objects[1] },
    { source: objects[1], target: objects[2] },
    { source: objects[2], target: objects[3] },
    { source: objects[3], target: objects[4] },
    { source: objects[4], target: objects[5] },
    { source: objects[5], target: objects[6] },
    { source: objects[6], target: objects[0] }
  ];

  return { objects, connections };
}
