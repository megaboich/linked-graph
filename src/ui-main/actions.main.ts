import { createAction } from "typesafe-actions";
import {
  GraphObject,
  GraphConnection,
  GraphModel,
  GraphOptions
} from "src/data/graph-model";

/*
 * action creators
 */
export const selectObject = createAction(
  "SELECT_OBJECT",
  resolve => (object?: GraphObject) => resolve(object)
);

export const removeObject = createAction("REMOVE_OBJECT");

export const modifyObject = createAction(
  "MODIFY_OBJECT",
  resolve => (newObject: GraphObject, newConnections: GraphConnection[]) =>
    resolve({ newObject, newConnections })
);

export const loadGraph = createAction(
  "LOAD_GRAPH",
  resolve => (graph: GraphModel) => resolve(graph)
);

export const setOptions = createAction(
  "SET_OPTIONS",
  resolve => (options: GraphOptions) => resolve(options)
);
