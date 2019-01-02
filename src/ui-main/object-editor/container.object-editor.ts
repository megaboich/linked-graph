import { connect } from "react-redux";
import { AppState } from "src/store";
import { mainActionCreator } from "src/ui-main/actions.main";
import { objectEditorActionCreator } from "./actions.object-editor";
import { ObjectEditorComponent } from "./component.object-editor";

export const ObjectEditorComponentContainer = connect(
  (state: AppState) => ({
    isVisible: state.objectEditor.showEditor,
    object: state.objectEditor.object!,
    connections: state.objectEditor ? state.objectEditor.connections : [],
    allObjects: state.main.objects,
    allConnections: state.main.connections
  }),
  {
    editObject: mainActionCreator.modifyObject,
    removeObject: mainActionCreator.removeObject,
    hideObjectEditor: objectEditorActionCreator.hideObjectEditor,
    reverseConnection: objectEditorActionCreator.reverseConnection,
    addConnection: objectEditorActionCreator.addConnection,
    removeConnection: objectEditorActionCreator.removeConnection
  }
)(ObjectEditorComponent);
