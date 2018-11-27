import * as createStore from "redux-zero";
import Store from "redux-zero/interfaces/Store";

import { GraphVertex, GraphEdge } from "src/services/graph-model";
import { getInitialGraph } from "src/services/data-loader";

export interface AppState {
  selectedVertex?: GraphVertex;
  vertices: GraphVertex[];
  edges: GraphEdge[];
}

const defaultAppState: AppState = {
  ...getInitialGraph()
};

export const appStore: Store = (createStore as any)(defaultAppState);
