import { GraphModel } from "../graph-model";
import { deserializeGraph, serializeGraph } from "./graph-serializer";
import { getSamples } from "./data-loader";

const GRAPH_MODEL_LOCAL_STORAGE_KEY = "linked-graph-model";

export function loadGraphFromLocalStorage(): GraphModel {
  const serialized = window.localStorage.getItem(GRAPH_MODEL_LOCAL_STORAGE_KEY);
  if (serialized) {
    try {
      const model = deserializeGraph(serialized);
      return model;
    } catch (ex) {}
  }
  return getSamples()[0].getGraph();
}

export function saveGraphToLocalStorage(graph: GraphModel) {
  const serialized = serializeGraph(graph);
  window.localStorage.setItem(GRAPH_MODEL_LOCAL_STORAGE_KEY, serialized);
}
