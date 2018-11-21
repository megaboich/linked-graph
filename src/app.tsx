import { h, render } from "preact";

import "bulma/css/bulma.min.css";
import "./styles/main.css";

import { MainComponent } from "./ui/main";
import { ensure } from "./helpers/syntax";

async function runApplication() {
  const appContainer = ensure(document.getElementById("app-container"));
  appContainer.innerHTML = "";
  render(<MainComponent />, appContainer);
}

(window as any).runApplication = function() {
  runApplication();
};
