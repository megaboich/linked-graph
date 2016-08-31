import 'bulma'
import '../styles/main.css'

import {DataLoader} from './data-loader'
import {GraphDataBuilder} from './graph-data'
import {GraphRender} from './graph-render'

import * as ko from "knockout";
import {SidePanelViewModel} from './side-panel'

let dataLoader = new DataLoader();
dataLoader.LoadData().then(triples => {
    let graph = GraphDataBuilder.BuildGraphData(triples);
    GraphRender.RenderGraph(graph);
});

let sidePanelModel = new SidePanelViewModel();
sidePanelModel.newNodeSubject.subscribe(name => {
    alert('Aha! ' + name);
})
ko.applyBindings(sidePanelModel, document.getElementById('#side-panel'));