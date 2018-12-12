import { getRandomName, getRandomNumber } from "src/helpers/random";

import { AppState, MainState } from "../store";
import { GraphObject, GraphConnection } from "../data/graph-model";
import { saveGraphToLocalStorage } from "../data/graph-local-storage";

import { ActionType, getType } from "typesafe-actions";

import * as actionCreators from "./actions.main";
type Action = ActionType<typeof actionCreators>;

export function reducers(
  state: MainState | undefined,
  action: Action
): MainState {
  if (!state) {
    return null as any; //This effectively skips initial state because that is defined in the store initialization
  }
  switch (action.type) {
    case getType(actionCreators.removeObject):
      return removeObject(state);
    case getType(actionCreators.loadGraph):
      return loadGraph(
        state,
        action.payload.objects,
        action.payload.connections
      );
    case getType(actionCreators.modifyObject):
      return editObject(
        state,
        action.payload.newObject,
        action.payload.newConnections
      );
    case getType(actionCreators.selectObject):
      return selectObject(state, action.payload);
    default:
      return state;
  }
}

function selectObject(state: MainState, object?: GraphObject): MainState {
  return {
    ...state,
    selectedObject: object
  };
}

function removeObject(state: MainState): MainState {
  if (state.selectedObject) {
    const idToDelete = state.selectedObject.id;
    const objects = state.objects.filter(x => x.id != idToDelete);
    const connections = state.connections.filter(
      x => x.source.id != idToDelete && x.target.id != idToDelete
    );

    const newState: MainState = {
      ...state,
      objects: objects,
      connections: connections,
      selectedObject: undefined
    };
    saveGraphToLocalStorage(newState);
    return newState;
  }
  return state;
}

function editObject(
  state: MainState,
  newObject: GraphObject,
  newConnections: GraphConnection[]
): MainState {
  // delete old Object and its Connections from state
  const objects = state.objects.filter(x => x.id !== newObject.id);
  const connections = state.connections.filter(
    x => x.source.id !== newObject.id && x.target.id !== newObject.id
  );

  // Change the reference in connections to new object
  for (const connection of newConnections) {
    if (connection.source.id === newObject.id) {
      connection.source = newObject;
    }
    if (connection.target.id === newObject.id) {
      connection.target = newObject;
    }
  }

  // If this a new object then we need to generate Id for it
  if (!newObject.id) {
    newObject.id = generateUniqueObjectId(state.objects);
  }

  // add new Object and Fixed connections
  objects.push(newObject);
  connections.push(...newConnections);

  const newState: MainState = {
    ...state,
    objects: objects,
    connections: connections,
    selectedObject: newObject
  };

  saveGraphToLocalStorage(newState);
  return newState;
}

function loadGraph(
  state: MainState,
  objects: GraphObject[],
  connections: GraphConnection[]
): MainState {
  return {
    ...state,
    objects: objects,
    connections: connections,
    selectedObject: undefined
  };
}

function generateUniqueObjectId(existingObjects: GraphObject[]): string {
  let randomId = getRandomName();
  while (existingObjects.some(x => x.id === randomId)) {
    randomId = getRandomName();
  }
  return randomId;
}
