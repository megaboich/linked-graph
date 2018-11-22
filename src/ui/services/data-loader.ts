import { GraphNode, GraphLink } from "../graph/objects";
import { getRandomNumber } from "src/helpers/random";

function getRandomCoordinates() {
  return {
    x: getRandomNumber(10, 590),
    y: getRandomNumber(10, 590)
  };
}

export function getInitialGraph() {
  const nodes: GraphNode[] = [
    { id: "W", ...getRandomCoordinates() },
    { id: "E", ...getRandomCoordinates() },
    { id: "B", ...getRandomCoordinates() },
    { id: "C", ...getRandomCoordinates() },
    { id: "O", ...getRandomCoordinates() },
    { id: "L", ...getRandomCoordinates() },
    { id: "A", ...getRandomCoordinates() }
  ];

  const links: GraphLink[] = [
    { source: nodes[0], target: nodes[1] },
    { source: nodes[1], target: nodes[2] },
    { source: nodes[2], target: nodes[3] },
    { source: nodes[3], target: nodes[4] },
    { source: nodes[4], target: nodes[5] },
    { source: nodes[5], target: nodes[6] },
    { source: nodes[6], target: nodes[0] }
  ];

  return { nodes, links };
}
