import "bulma/css/bulma.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { DataLoader } from "./data-loader";
import { ApplicationState } from "./app-state";

import { GraphRender } from "./graph/graph-render";
import { ControlPanelComponent } from "./control-panel/control-panel";
import "./styles/main.css";

async function runApplication() {
  const appState = new ApplicationState();

  const render = new GraphRender(appState.graph, appState.selectedNodeSubject);

  appState.graphUpdatedSubject.subscribe(() => {
    render.updateGraph();
  });

  ReactDOM.render(
    <ControlPanelComponent appState={appState} />,
    document.getElementById("cp-holder")
  );

  const dataLoader = new DataLoader();
  const triples = await dataLoader.loadData();
  appState.appendTriplesToGraph(triples);
}

runApplication();
