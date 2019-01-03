import { GraphObject, GraphConnection } from "src/data/graph-model";

export interface ObjectEditorState {
  showEditor: boolean;
  object: GraphObject | undefined;
  connections: Partial<GraphConnection>[];
}

export const defaultObjectEditorState: ObjectEditorState = {
  showEditor: false,
  object: undefined,
  connections: []
};
