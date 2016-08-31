import 'bulma'
import '../styles/main.css'

import {DataLoader} from './data-loader'
import {GraphDataBuilder} from './graph-data'
import {GraphRender} from './graph-render'


let dataLoader = new DataLoader();
dataLoader.LoadData().then(triples => {
    let graph = GraphDataBuilder.BuildGraphData(triples);
    GraphRender.RenderGraph(graph);
});