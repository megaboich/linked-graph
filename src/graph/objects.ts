export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  selected?: boolean;
  fixed?: number;
  px?: number;
  py?: number;
}

export interface GraphLink {
  id: string;
  source: GraphNode;
  target: GraphNode;
}
