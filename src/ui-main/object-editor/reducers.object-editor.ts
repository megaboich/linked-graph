import { AppState, ObjectEditorState } from "src/store";
import { GraphConnection, GraphObject } from "src/data/graph-model";

import { ActionType, getType } from "typesafe-actions";

import * as actionCreators from "./actions.object-editor";
type Action = ActionType<typeof actionCreators>;

export function reducers(
  state: ObjectEditorState | undefined,
  action: Action
): ObjectEditorState {
  if (!state) {
    return null as any; //This effectively skips initial state because that is defined in the store initialization
  }
  switch (action.type) {
    case getType(actionCreators.showObjectEditor):
      return showObjectEditor(
        state,
        action.payload.object,
        action.payload.connections
      );
    case getType(actionCreators.hideObjectEditor):
      return hideObjectEditor(state);
    case getType(actionCreators.addConnection):
      return addConnection(state);
    case getType(actionCreators.removeConnection):
      return removeConnection(state, action.payload);
    case getType(actionCreators.reverseConnection):
      return reverseConnection(state, action.payload);
    default:
      return state;
  }
}

function hideObjectEditor(state: ObjectEditorState): ObjectEditorState {
  return {
    ...state,
    showEditor: false,
    object: undefined,
    connections: []
  };
}

function showObjectEditor(
  state: ObjectEditorState,
  object: GraphObject,
  connections: Partial<GraphConnection>[]
): ObjectEditorState {
  return {
    ...state,
    showEditor: true,
    object,
    connections
  };
}

function reverseConnection(
  state: ObjectEditorState,
  connection: Partial<GraphConnection>
): ObjectEditorState {
  const newConnection: Partial<GraphConnection> = {
    source: connection.target,
    target: connection.source,
    relation: connection.relation
  };
  const index = state.connections.indexOf(connection);
  if (index >= 0) {
    const connections = state.connections.slice();
    connections.splice(index, 1, newConnection);
    return {
      ...state,
      connections
    };
  }
  return state;
}

function addConnection(state: ObjectEditorState): ObjectEditorState {
  const newConnection: Partial<GraphConnection> = {
    source: state.object
  };
  return {
    ...state,
    connections: [...state.connections, newConnection]
  };
}

function removeConnection(
  state: ObjectEditorState,
  connection: Partial<GraphConnection>
): ObjectEditorState {
  const connections = state.connections.filter(x => x !== connection);
  return {
    ...state,
    connections
  };
}
