import 'bulma'
import '../styles/main.css'
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {DataLoader} from './data-loader'
import {GraphDataBuilder, GraphData, GraphNode} from './graph-data'
import {ApplicationState} from './app-state'

import {GraphRender} from './graph-render'
import {ControlPanelComponent, IControlPanelProps} from './control-panel'

let appState = new ApplicationState();

let render = new GraphRender(appState.graph, appState.selectedNodeSubject);

appState.graphUpdatedSubject.subscribe(() => {
    render.updateGraph();
})

let controlPanelProps: IControlPanelProps = {
    appState: appState
};
ReactDOM.render(
    React.createElement(ControlPanelComponent, controlPanelProps),
    document.getElementById('cp-holder')
);

let dataLoader = new DataLoader();
dataLoader.LoadData().then(triples => {
    appState.appendTriplesToGraph(triples);
});

