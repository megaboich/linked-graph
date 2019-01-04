export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;

  fixed?: number;
  px?: number;
  py?: number;
}

export interface GraphLink {
  source: GraphNode;
  target: GraphNode;
  relation: string;
}
