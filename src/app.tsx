import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";

import { ensure } from "./helpers/syntax";
import { store, AppState } from "./services/store";
import * as actionCreators from "./services/action-creators";
import { MainComponent } from "./ui/main.component";

import "bulma/css/bulma.min.css";
import "./ui/styles/shared.less";
import "./app.less";

const ConnectedMain = connect(
  // Map state
  (state: AppState) => ({
    objects: state.objects,
    connections: state.connections,
    selectedObject: state.selectedObject,
    showObjectDetails: state.showObjectDetails
  }),
  // Map actions
  {
    selectObject: actionCreators.selectObject,
    addObject: actionCreators.addObject,
    removeObject: actionCreators.removeObject,
    toggleObjectDetails: actionCreators.toggleObjectDetails,
    editObject: actionCreators.modifyObject,
    loadGraph: actionCreators.loadGraph
  }
)(MainComponent);

async function runApplication() {
  const appContainer = ensure(document.getElementById("app-container"));
  appContainer.innerHTML = "";

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedMain />
    </Provider>,
    appContainer
  );
}

(window as any).runApplication = function() {
  runApplication();
};
