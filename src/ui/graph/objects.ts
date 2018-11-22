export interface GraphNode {
  id: string;
  label?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  selected?: boolean;
}

export interface GraphLink {
  source: GraphNode;
  target: GraphNode;
}
