import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import {
  GraphObject,
  GraphConnection,
  GraphOptions
} from "src/data/graph-model";
import { loadGraphFromLocalStorage } from "./data/graph-local-storage";
import { reducers as mainReducers } from "./ui-main/reducers.main";
import { reducers as objectEditorReducers } from "./ui-main/object-editor/reducers.object-editor";

export interface AppState {
  main: MainState;
  objectEditor: ObjectEditorState;
}

export interface MainState {
  selectedObject: GraphObject | undefined;
  objects: GraphObject[];
  connections: GraphConnection[];
  options: GraphOptions;
}

export interface ObjectEditorState {
  showEditor: boolean;
  object: GraphObject | undefined;
  connections: Partial<GraphConnection>[];
}

export const defaultAppState: AppState = {
  main: {
    ...loadGraphFromLocalStorage(),
    selectedObject: undefined
  },
  objectEditor: {
    showEditor: false,
    object: undefined,
    connections: []
  }
};

export const store = createStore(
  combineReducers({
    main: mainReducers,
    objectEditor: objectEditorReducers
  }),
  defaultAppState,
  composeWithDevTools()
);
