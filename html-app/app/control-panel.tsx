import * as React from 'react';
import {ApplicationState} from './app-state'
import {GraphData, GraphLink, GraphNode} from './graph-data'

export interface IControlPanelState {
    newNodeName?: string
    selectedNode?: GraphNode
}

export interface IControlPanelProps {
    appState: ApplicationState
}

export class ControlPanelComponent extends React.Component<IControlPanelProps, IControlPanelState> {

    state: IControlPanelState = { newNodeName: `` }

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.appState.selectedNodeSubject.subscribe(node => {
            this.setState({
                selectedNode: node
            });
        })
    }

    changeName = (e: any) => {
        this.setState({
            newNodeName: e.target.value
        });
    }

    addNode = () => {
        this.props.appState.addNode(this.state.newNodeName);
        this.setState({
            newNodeName: ``
        });
    }

    render() {
        let newNodeSection = this.getNewNodeSectionMarkUp();
        let selectedNodeSection = this.getSelectedNodeSectionMarkup();
        return (
            <div>
                {newNodeSection}
                {selectedNodeSection}
            </div>
        );
    }

    getNewNodeSectionMarkUp() {
        return <div className="box">
            <p className="control has-addons">
                <input
                    className="input"
                    type="text"
                    placeholder="New node name"
                    value={this.state.newNodeName}
                    onChange={this.changeName}
                    />
                <a
                    className="button is-info"
                    onClick={this.addNode}>
                    Add
                </a>
            </p>
        </div>
    }

    getSelectedNodeSectionMarkup() {
        if (this.state.selectedNode) {
            return <div className="box">
                <p className="control has-addons">
                    SelectedNode: {this.state.selectedNode.id}
                </p>
            </div>
        }
    }
}
