import { action, ActionType } from "typesafe-actions";
import {
  GraphObject,
  GraphConnection,
  GraphModel,
  GraphOptions
} from "src/data/graph-model";

export enum MainActionType {
  LOAD_GRAPH = "LOAD_GRAPH",
  SELECT_OBJECT = "SELECT_OBJECT",
  MODIFY_OBJECT = "MODIFY_OBJECT",
  REMOVE_OBJECT = "REMOVE_OBJECT",
  SET_OPTIONS = "SET_OPTIONS",
  UNDO = "UNDO"
}

export const mainActionCreator = {
  selectObject: (object?: GraphObject) =>
    action(MainActionType.SELECT_OBJECT, object),

  removeObject: () => action(MainActionType.REMOVE_OBJECT),

  modifyObject: (newObject: GraphObject, newConnections: GraphConnection[]) =>
    action(MainActionType.MODIFY_OBJECT, { newObject, newConnections }),

  loadGraph: (graph: GraphModel) => action(MainActionType.LOAD_GRAPH, graph),

  setOptions: (options: GraphOptions) =>
    action(MainActionType.SET_OPTIONS, options),

  undo: () => action(MainActionType.UNDO)
};

export type MainAction = ActionType<typeof mainActionCreator>;
