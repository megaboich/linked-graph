import { connect } from "react-redux";
import { AppState } from "src/store";
import * as actionCreatorsMain from "src/ui-main/actions.main";
import * as actionCreatorsObjectEditor from "src/ui-main/object-editor/actions.object-editor";
import { MainComponent } from "./component.main";

export const MainContainer = connect(
  // Map state
  (state: AppState) => ({
    objects: state.main.objects,
    connections: state.main.connections,
    selectedObject: state.main.selectedObject
  }),
  // Map actions
  {
    selectObject: actionCreatorsMain.selectObject,
    addObject: actionCreatorsObjectEditor.createNewObject,
    showObjectEditor: actionCreatorsObjectEditor.showObjectEditor,
    loadGraph: actionCreatorsMain.loadGraph
  }
)(MainComponent);
