import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { ensure } from "./helpers/syntax";

// Use optimized bulma include to save bundle size
// import "bulma/css/bulma.min.css";
import "src/styles/bulma-include.scss";
import "src/styles/shared.less";
import "./app.less";

import { store } from "./store";
import { MainContainer } from "./ui-main/container.main";

function runApplication() {
  const appContainer = ensure(document.getElementById("app-container"));
  appContainer.innerHTML = "";

  ReactDOM.render(
    <Provider store={store}>
      <MainContainer />
    </Provider>,
    appContainer
  );
}

(window as any).runApplication = runApplication;
