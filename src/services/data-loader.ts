import { getRandomNumber } from "src/helpers/random";
import { GraphVertex, GraphEdge } from "src/services/graph-model";

function getRandomCoordinates() {
  return {
    x: getRandomNumber(10, 590),
    y: getRandomNumber(10, 590)
  };
}

export function getInitialGraph() {
  const vertices: GraphVertex[] = [
    { id: "W", ...getRandomCoordinates() },
    { id: "E", ...getRandomCoordinates() },
    { id: "B", ...getRandomCoordinates() },
    { id: "C", ...getRandomCoordinates() },
    { id: "O", ...getRandomCoordinates() },
    { id: "L", ...getRandomCoordinates() },
    { id: "A", ...getRandomCoordinates() }
  ];

  const edges: GraphEdge[] = [
    { source: vertices[0], target: vertices[1] },
    { source: vertices[1], target: vertices[2] },
    { source: vertices[2], target: vertices[3] },
    { source: vertices[3], target: vertices[4] },
    { source: vertices[4], target: vertices[5] },
    { source: vertices[5], target: vertices[6] },
    { source: vertices[6], target: vertices[0] }
  ];

  return { vertices, edges };
}
