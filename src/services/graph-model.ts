export interface GraphVertex {
  id: string;
  label?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface GraphEdge {
  source: GraphVertex;
  target: GraphVertex;
}
