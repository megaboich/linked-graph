import * as React from 'react';
import {ApplicationState} from '../app-state'
import {GraphData, GraphLink, GraphNode} from '../graph-data'
import * as classnames from 'classnames'

export interface IConnectModalState {
    predicate?: string;
    targetNode?: GraphNode;
}

export interface IConnectModalProps {
    isActive: boolean;
    selectedNode: GraphNode;
    allNodes: GraphNode[];
    onClose: () => void;
    onAddLink: (GraphLink) => void;
}

export class ConnectModalComponent extends React.Component<IConnectModalProps, IConnectModalState> {
    state: IConnectModalState = {
        predicate: `relates`,
    };

    constructor() {
        super();
    }

    componentDidMount() {
    }

    changePredicate = (e: any) => {
        this.setState({
            predicate: e.target.value
        });
    }

    targetSelected = (e: any) => {
        var selVal = e.target.value;
        this.setState({
            targetNode: this.props.allNodes.find(p => p.id === selVal)
        });
    }

    onConnectClick = () => {
        let newLink: GraphLink = {
            source: this.props.selectedNode,
            target: this.state.targetNode,
            predicate: this.state.predicate,
            value: 30
        }

        this.props.onAddLink(newLink);
        this.props.onClose();
    }

    render(): JSX.Element {
        if (!this.props.isActive) {
            return null;
        }
        return <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Connect {this.props.selectedNode.id}</p>
                    <button className="delete" onClick={this.props.onClose}></button>
                </header>
                <section className="modal-card-body">
                    <label className="label">Predicate</label>
                    <p className="control">
                        <input className="input" type="text" placeholder="Predicate"
                            value={this.state.predicate}
                            onChange={this.changePredicate} />
                    </p>
                    <label className="label">Object</label>
                    <p className="control">
                        <span className="select">
                            <select onChange={this.targetSelected}>
                                {this.props.allNodes
                                    .filter(p => p.id != this.props.selectedNode.id)
                                    .map(p => <option key={p.id} value={p.id}>{p.id}</option>)
                                }
                            </select>
                        </span>
                    </p>
                </section>
                <footer className="modal-card-foot">
                    <a className="button is-primary" onClick={this.onConnectClick}>Connect</a>
                    <a className="button" onClick={this.props.onClose}>Cancel</a>
                </footer>
            </div>
        </div>
    }
}
