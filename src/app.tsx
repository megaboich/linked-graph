import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { ensure } from "./helpers/syntax";

import "bulma/css/bulma.min.css";
import "src/styles/shared.less";
import "./app.less";

import { store } from "./store";
import { MainContainer } from "./ui-main/container.main";

async function runApplication() {
  const appContainer = ensure(document.getElementById("app-container"));
  appContainer.innerHTML = "";

  ReactDOM.render(
    <Provider store={store}>
      <MainContainer />
    </Provider>,
    appContainer
  );
}

(window as any).runApplication = function() {
  runApplication();
};
