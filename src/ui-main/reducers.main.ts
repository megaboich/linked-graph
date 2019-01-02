import { getRandomName } from "src/helpers/random";

import { MainState } from "../store";
import {
  GraphObject,
  GraphConnection,
  GraphOptions,
  GraphModel
} from "../data/graph-model";
import { saveGraphToLocalStorage } from "../data/graph-local-storage";
import { MainAction, MainActionType } from "./actions.main";

export function reducers(
  state: MainState | undefined,
  action: MainAction
): MainState {
  if (!state) {
    return null as any; //This effectively skips initial state because that is defined in the store initialization
  }
  switch (action.type) {
    case MainActionType.REMOVE_OBJECT:
      return removeObject(state);
    case MainActionType.LOAD_GRAPH:
      return loadGraph(state, action.payload);
    case MainActionType.MODIFY_OBJECT:
      return editObject(
        state,
        action.payload.newObject,
        action.payload.newConnections
      );
    case MainActionType.SELECT_OBJECT:
      return selectObject(state, action.payload);
    case MainActionType.SET_OPTIONS:
      return setOptions(state, action.payload);
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

  // Update references in connections to actual objects
  for (const connection of newConnections) {
    if (connection.source.id === newObject.id) {
      connection.source = newObject;
    }
    if (connection.target.id === newObject.id) {
      connection.target = newObject;
    }
    if (!connection.source.id) {
      connection.source.id = generateUniqueObjectId(objects);
      connection.source.x = connection.target.x;
      connection.source.y = connection.target.y;
      objects.push(connection.source);
    }
    if (!connection.target.id) {
      connection.target.id = generateUniqueObjectId(objects);
      connection.target.x = connection.source.x;
      connection.target.y = connection.source.y;
      objects.push(connection.target);
    }
  }

  // If this a new object then we need to generate Id for it
  if (!newObject.id) {
    newObject.id = generateUniqueObjectId(objects);
  }

  // add new Object and Fixed connections
  if (!objects.includes(newObject)) {
    objects.push(newObject);
  }
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

function loadGraph(state: MainState, model: GraphModel): MainState {
  return {
    ...state,
    ...model,
    selectedObject: undefined
  };
}

function setOptions(state: MainState, options: GraphOptions): MainState {
  const newOptions = { ...options };
  const newState = {
    ...state,
    options: newOptions
  };
  saveGraphToLocalStorage(newState);
  return newState;
}

function generateUniqueObjectId(existingObjects: GraphObject[]): string {
  let randomId = getRandomName();
  while (existingObjects.some(x => x.id === randomId)) {
    randomId = getRandomName();
  }
  return randomId;
}
