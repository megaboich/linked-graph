import { connect } from "react-redux";
import { AppState } from "src/store";
import * as mainActionCreators from "src/ui-main/actions.main";
import * as actionCreators from "./actions.object-editor";
import { ObjectEditorComponent } from "./component.object-editor";

export const ObjectEditorComponentContainer = connect(
  (state: AppState) => ({
    allObjects: state.main.objects,
    isVisible: state.objectEditor.showEditor,
    object: state.objectEditor.object!,
    connections: state.objectEditor ? state.objectEditor.connections : []
  }),
  {
    removeObject: mainActionCreators.removeObject,
    hideObjectEditor: actionCreators.hideObjectEditor,
    editObject: mainActionCreators.modifyObject,
    reverseConnection: actionCreators.reverseConnection,
    addConnection: actionCreators.addConnection,
    removeConnection: actionCreators.removeConnection
  }
)(ObjectEditorComponent);
