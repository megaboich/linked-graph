import { connect } from "react-redux";
import { AppState } from "src/store";
import { mainActionCreator } from "src/ui-main/actions.main";
import { objectEditorActionCreator } from "src/ui-main/object-editor/actions.object-editor";
import { MainComponent } from "./component.main";

export const MainContainer = connect(
  // Map state
  (state: AppState) => ({
    objects: state.main.objects,
    connections: state.main.connections,
    selectedObject: state.main.selectedObject,
    options: state.main.options,
    undoActionsCount: state.main.snapshots.length
  }),
  // Map actions
  {
    selectObject: mainActionCreator.selectObject,
    addObject: objectEditorActionCreator.createNewObject,
    showObjectEditor: objectEditorActionCreator.showObjectEditor,
    loadGraph: mainActionCreator.loadGraph,
    setOptions: mainActionCreator.setOptions,
    undo: mainActionCreator.undo
  }
)(MainComponent);
