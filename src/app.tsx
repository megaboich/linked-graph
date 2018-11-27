import { h, render } from "preact";
import { Provider, connect } from "redux-zero/preact";
import "bulma/css/bulma.min.css";
import { ensure } from "./helpers/syntax";

import { appStore, AppState } from "./services/store";
import { actions } from "./services/actions";
import { MainComponent } from "./ui/main";

const ConnectedMain = connect(
  (state: AppState) => state,
  actions
)(MainComponent);

async function runApplication() {
  const appContainer = ensure(document.getElementById("app-container"));
  appContainer.innerHTML = "";

  render(
    <Provider store={appStore}>
      <ConnectedMain />
    </Provider>,
    appContainer
  );
}

(window as any).runApplication = function() {
  runApplication();
};
