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
    let render = new GraphRender(graph);

    let sidePanelModel = new SidePanelViewModel();
    sidePanelModel.newNodeSubject.subscribe(name => {
        graph.nodes.push({ id: name, group: 1, x: 300, y: 300 });
        render.updateGraph();
    })
    ko.applyBindings(sidePanelModel, document.getElementById('#side-panel'));
});

