import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from "redux-zero/react";
import "bulma/css/bulma.min.css";

import { ensure } from "./helpers/syntax";

import { appStore } from "./services/store";
import { actions } from "./services/actions";
import { MainComponent } from "./ui/main.component";

import "./ui/styles/shared.less";
import "./app.less";

const ConnectedMain = connect(
  (state: any) => state,
  actions
)(MainComponent);

async function runApplication() {
  const appContainer = ensure(document.getElementById("app-container"));
  appContainer.innerHTML = "";

  ReactDOM.render(
    <Provider store={appStore}>
      <ConnectedMain />
    </Provider>,
    appContainer
  );
}

(window as any).runApplication = function() {
  runApplication();
};
