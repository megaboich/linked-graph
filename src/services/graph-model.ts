export interface GraphObject {
  id: string;
  label?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface GraphConnection {
  source: GraphObject;
  target: GraphObject;
}
