import 'bulma'
import '../styles/main.css'

import {DataLoader} from './data-loader'
import {GraphDataBuilder, GraphData, GraphNode} from './graph-data'
import {GraphRender} from './graph-render'

import * as ko from "knockout";
import {SidePanelViewModel} from './side-panel'

let graph = new GraphData();
let render = new GraphRender(graph);

let sidePanelModel = new SidePanelViewModel();
sidePanelModel.bindToDom('#side-panel');
sidePanelModel.newNodeSubject.subscribe(name => {
    let newNode: GraphNode = { id: name, group: 1, x: 300, y: 300, selected: true };
    graph.nodes.push(newNode);
    render.updateGraph();

    render.selectedNodeSubject.next(newNode);
});

render.selectedNodeSubject.subscribe(node => {
    console.log('Ho Ho ', node);
});

let dataLoader = new DataLoader();
dataLoader.LoadData().then(triples => {
    let newData = GraphDataBuilder.BuildGraphData(triples);
    newData.nodes.forEach(n => graph.nodes.push(n));
    newData.links.forEach(l => graph.links.push(l));
    render.updateGraph();
});

