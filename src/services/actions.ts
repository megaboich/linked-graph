import Store from "redux-zero/interfaces/Store";
import { getRandomName, getRandomNumber } from "src/helpers/random";

import { AppState } from "./store";
import { GraphObject, GraphConnection } from "./graph-model";

export const actions = (store: Store) => ({
  selectObject,
  removeObject,
  addObject,
  toggleObjectDetails: (state: AppState, show: boolean): AppState => {
    return {
      ...state,
      showObjectDetails: show
    };
  },
  editObject
});

function selectObject(state: AppState, object?: GraphObject): AppState {
  return {
    ...state,
    selectedObject: object
  };
}

function addObject(state: AppState): AppState {
  const prevObj =
    state.objects.length >= 1
      ? state.selectedObject || state.objects[state.objects.length - 1]
      : undefined;

  // Generate unique object Id
  let randomId = getRandomName();
  while (state.objects.some(x => x.id === randomId)) {
    randomId = getRandomName();
  }
  const newObj: GraphObject = {
    id: randomId,
    label: randomId,
    x: prevObj
      ? prevObj.x + getRandomNumber(-50, 50)
      : getRandomNumber(10, 590),
    y: prevObj ? prevObj.y + getRandomNumber(-50, 50) : getRandomNumber(10, 390)
  };
  const objects = [...state.objects, newObj];
  const connections = [...state.connections];

  if (prevObj) {
    const newConnection: GraphConnection = {
      source: prevObj,
      target: newObj
    };
    connections.push(newConnection);
  }

  return {
    ...state,
    objects: objects,
    connections: connections,
    selectedObject: newObj
  };
}

function removeObject(state: AppState): AppState {
  if (state.selectedObject) {
    const idToDelete = state.selectedObject.id;
    const objects = state.objects.filter(x => x.id != idToDelete);
    const connections = state.connections.filter(
      x => x.source.id != idToDelete && x.target.id != idToDelete
    );
    return {
      ...state,
      objects: objects,
      connections: connections,
      selectedObject: undefined
    };
  }
  return state;
}

function editObject(
  state: AppState,
  newObject: GraphObject,
  newConnections: GraphConnection[]
): AppState {
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

  // add new Object and Fixed connections
  objects.push(newObject);
  connections.push(...newConnections);

  return {
    ...state,
    objects: objects,
    connections: connections,
    selectedObject: newObject
  };
}
