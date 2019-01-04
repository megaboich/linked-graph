import { action, ActionType } from "typesafe-actions";
import { GraphObject, GraphConnection } from "src/data/graph-model";

export enum ObjectEditorActionType {
  SHOW_OBJ_EDITOR = "SHOW_OBJ_EDITOR",
  HIDE_OBJ_EDITOR = "HIDE_OBJ_EDITOR",
  ADD_CONNECTION = "ADD_CONNECTION",
  REMOVE_CONNECTION = "REMOVE_CONNECTION",
  REVERSE_CONNECTION = "REVERSE_CONNECTION"
}

export const objectEditorActionCreator = {
  showObjectEditor: (object: GraphObject, connections: GraphConnection[]) => {
    const relatedConnections = connections
      .filter(x => x.source === object || x.target === object)
      .map(x => ({ ...x }));
    return action(ObjectEditorActionType.SHOW_OBJ_EDITOR, {
      object,
      connections: relatedConnections
    });
  },

  createNewObject: (selectedObject?: GraphObject) => {
    const newObject: GraphObject = {
      id: "",
      label: "",
      x: 0,
      y: 0
    };
    const connections: GraphConnection[] = [];
    if (selectedObject) {
      connections.push({
        source: selectedObject,
        target: newObject,
        relation: "related to"
      });
    }
    return action(ObjectEditorActionType.SHOW_OBJ_EDITOR, {
      object: newObject,
      connections
    });
  },

  hideObjectEditor: () => action(ObjectEditorActionType.HIDE_OBJ_EDITOR),

  addConnection: (defaultRelation: string) =>
    action(ObjectEditorActionType.ADD_CONNECTION, defaultRelation),

  removeConnection: (connection: Partial<GraphConnection>) =>
    action(ObjectEditorActionType.REMOVE_CONNECTION, connection),

  reverseConnection: (connection: Partial<GraphConnection>) =>
    action(ObjectEditorActionType.REVERSE_CONNECTION, connection)
};

export type ObjectEditorAction = ActionType<typeof objectEditorActionCreator>;
