import * as React from "react";
import * as ReactDOM from "react-dom";

import "bulma/css/bulma.min.css";
import "./styles/main.css";

import { MainComponent } from "./ui/main";

async function runApplication() {
  ReactDOM.render(<MainComponent />, document.getElementById("app-container"));
}

(window as any).runApplication = function() {
  runApplication();
};
