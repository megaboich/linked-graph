import * as createStore from "redux-zero";
import Store from "redux-zero/interfaces/Store";

import { GraphObject, GraphConnection } from "src/services/graph-model";
import { getInitialGraph } from "src/services/data-loader";

export interface AppState {
  selectedObject?: GraphObject;
  showObjectDetails?: boolean;
  objects: GraphObject[];
  connections: GraphConnection[];
}

const defaultAppState: AppState = {
  ...getInitialGraph()
};

export const appStore: Store = (createStore as any)(defaultAppState);
