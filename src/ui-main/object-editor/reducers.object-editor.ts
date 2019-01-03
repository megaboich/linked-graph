import { ObjectEditorState } from "./state.object-editor";
import { GraphConnection, GraphObject } from "src/data/graph-model";
import {
  ObjectEditorAction,
  ObjectEditorActionType
} from "./actions.object-editor";

export function reducers(
  state: ObjectEditorState | undefined,
  action: ObjectEditorAction
): ObjectEditorState {
  if (!state) {
    return null as any; //This effectively skips initial state because that is defined in the store initialization
  }
  switch (action.type) {
    case ObjectEditorActionType.SHOW_OBJ_EDITOR:
      return showObjectEditor(
        state,
        action.payload.object,
        action.payload.connections
      );
    case ObjectEditorActionType.HIDE_OBJ_EDITOR:
      return hideObjectEditor(state);
    case ObjectEditorActionType.ADD_CONNECTION:
      return addConnection(state);
    case ObjectEditorActionType.REMOVE_CONNECTION:
      return removeConnection(state, action.payload);
    case ObjectEditorActionType.REVERSE_CONNECTION:
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
