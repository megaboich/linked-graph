import {
  GraphObject,
  GraphConnection,
  GraphOptions
} from "src/data/graph-model";
import { loadGraphFromLocalStorage } from "src/data/graph-local-storage";

export interface MainState {
  selectedObject: GraphObject | undefined;
  objects: GraphObject[];
  connections: GraphConnection[];
  options: GraphOptions;
  snapshots: string[];
}

export const defaultMainState: MainState = {
  ...loadGraphFromLocalStorage(),
  selectedObject: undefined,
  snapshots: []
};
