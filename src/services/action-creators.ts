import { action, createAction } from "typesafe-actions";
import { GraphObject, GraphConnection, GraphModel } from "./graph-model";

/*
 * action creators
 */
export const selectObject = createAction(
  "SELECT_OBJECT",
  resolve => (object?: GraphObject) => resolve(object)
);

export const removeObject = createAction("REMOVE_OBJECT");

export const addObject = createAction("ADD_OBJECT");

export const toggleObjectDetails = createAction(
  "TOGGLE_OBJECT_DETAILS",
  resolve => (show: boolean) => resolve(show)
);

export const modifyObject = createAction(
  "MODIFY_OBJECT",
  resolve => (newObject: GraphObject, newConnections: GraphConnection[]) =>
    resolve({ newObject, newConnections })
);

export const loadGraph = createAction(
  "LOAD_GRAPH",
  resolve => (graph: GraphModel) => resolve(graph)
);
