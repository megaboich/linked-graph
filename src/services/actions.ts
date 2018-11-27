import Store from "redux-zero/interfaces/Store";
import { getRandomName, getRandomNumber } from "src/helpers/random";

import { AppState } from "./store";
import { GraphVertex, GraphEdge } from "./graph-model";

export const actions = (store: Store) => ({
  selectVertex,
  removeVertex,
  addVertex
});

function selectVertex(state: AppState, vertex?: GraphVertex): AppState {
  return {
    ...state,
    selectedVertex: vertex
  };
}

function addVertex(state: AppState): AppState {
  const prevVertex =
    state.vertices.length >= 1
      ? state.selectedVertex || state.vertices[state.vertices.length - 1]
      : undefined;

  const randomId = getRandomName();
  const newVertex: GraphVertex = {
    id: randomId,
    label: randomId,
    x: prevVertex
      ? prevVertex.x + getRandomNumber(-50, 50)
      : getRandomNumber(10, 590),
    y: prevVertex
      ? prevVertex.y + getRandomNumber(-50, 50)
      : getRandomNumber(10, 390)
  };
  const newVertices = [...state.vertices, newVertex];
  const newEdges = [...state.edges];

  if (prevVertex) {
    const newEdge: GraphEdge = {
      source: prevVertex,
      target: newVertex
    };
    newEdges.push(newEdge);
  }

  return {
    ...state,
    vertices: newVertices,
    edges: newEdges,
    selectedVertex: newVertex
  };
}

function removeVertex(state: AppState): AppState {
  if (state.selectedVertex) {
    const vertexIdToDelete = state.selectedVertex.id;
    const newVertices = state.vertices.filter(x => x.id != vertexIdToDelete);
    const newEdges = state.edges.filter(
      x => x.source.id != vertexIdToDelete && x.target.id != vertexIdToDelete
    );
    return {
      ...state,
      vertices: newVertices,
      edges: newEdges,
      selectedVertex: undefined
    };
  }
  return state;
}
