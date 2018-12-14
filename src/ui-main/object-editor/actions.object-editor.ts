import { createAction } from "typesafe-actions";
import { GraphObject, GraphConnection } from "src/data/graph-model";

/*
 * action creators
 */

export const showObjectEditor = createAction(
  "SHOW_OBJ_EDITOR",
  resolve => (object: GraphObject, connections: GraphConnection[]) => {
    const relatedConnections = connections
      .filter(x => x.source === object || x.target === object)
      .map(x => ({ ...x }));
    return resolve({
      object,
      connections: relatedConnections
    });
  }
);

export const createNewObject = createAction(
  "SHOW_OBJ_EDITOR",
  resolve => (selectedObject?: GraphObject) => {
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
    return resolve({
      object: newObject,
      connections
    });
  }
);

export const hideObjectEditor = createAction("HIDE_OBJ_EDITOR");

export const addConnection = createAction("ADD_CONNECTION");

export const removeConnection = createAction(
  "REMOVE_CONNECTION",
  resolve => (connection: Partial<GraphConnection>) => resolve(connection)
);

export const reverseConnection = createAction(
  "REVERSE_CONNECTION",
  resolve => (connection: Partial<GraphConnection>) => resolve(connection)
);
