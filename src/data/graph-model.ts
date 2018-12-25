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
  relation: string;
}

export interface GraphModel {
  objects: GraphObject[];
  connections: GraphConnection[];
  options: GraphOptions;
}

export interface GraphOptions {
  drawLinkArrows: boolean;
  drawLinkText: boolean;
  useForceLayout: boolean;
  forceLayoutLinkLength: number;
}

export const defaultGraphOptions: GraphOptions = {
  drawLinkArrows: true,
  drawLinkText: true,
  forceLayoutLinkLength: 70,
  useForceLayout: true
};
