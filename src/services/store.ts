import * as createStore from "redux-zero";
import Store from "redux-zero/interfaces/Store";

import { GraphObject, GraphConnection } from "src/services/graph-model";
import { loadGraphFromLocalStorage } from "./data/graph-local-storage";

export interface AppState {
  selectedObject?: GraphObject;
  showObjectDetails?: boolean;
  objects: GraphObject[];
  connections: GraphConnection[];
}

const defaultAppState: AppState = {
  ...loadGraphFromLocalStorage()
};

export const appStore: Store = (createStore as any)(defaultAppState);
