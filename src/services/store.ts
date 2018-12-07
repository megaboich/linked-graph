import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import { GraphObject, GraphConnection } from "src/services/graph-model";
import { loadGraphFromLocalStorage } from "./data/graph-local-storage";
import { reducer } from "./reducers";

export interface AppState {
  selectedObject: GraphObject | undefined;
  showObjectDetails: boolean;
  objects: GraphObject[];
  connections: GraphConnection[];
}

export const defaultAppState: AppState = {
  ...loadGraphFromLocalStorage(),
  selectedObject: undefined,
  showObjectDetails: false
};

export const store = createStore(
  reducer,
  defaultAppState,
  composeWithDevTools()
);
