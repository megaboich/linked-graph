import * as React from "react";
import { GraphLink, GraphNode } from "../graph/graph-data";

export interface IConnectModalState {
  predicate?: string;
  targetNode?: GraphNode;
}

export interface IConnectModalProps {
  isActive?: boolean;
  selectedNode: GraphNode;
  allNodes: GraphNode[];
  onClose: () => void;
  onAddLink: (link: GraphLink) => void;
}

export class ConnectModalComponent extends React.Component<
  IConnectModalProps,
  IConnectModalState
> {
  constructor(props: IConnectModalProps) {
    super(props);
    this.state = {
      predicate: "relates"
    };
  }

  componentDidMount() {}

  changePredicate = (e: any) => {
    this.setState({
      predicate: e.target.value
    });
  };

  targetSelected = (e: any) => {
    const selVal = e.target.value;
    this.setState({
      targetNode: this.props.allNodes.find(p => p.id === selVal)
    });
  };

  onConnectClick = () => {
    if (this.state.targetNode) {
      const newLink: GraphLink = {
        source: this.props.selectedNode,
        target: this.state.targetNode,
        predicate: this.state.predicate,
        value: 30
      };
      this.props.onAddLink(newLink);
    }
    this.props.onClose();
  };

  render(): JSX.Element {
    if (!this.props.isActive) {
      return <></>;
    }
    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              Connect {this.props.selectedNode.id}
            </p>
            <button className="delete" onClick={this.props.onClose} />
          </header>
          <section className="modal-card-body">
            <label className="label">Predicate</label>
            <p className="control">
              <input
                className="input"
                type="text"
                placeholder="Predicate"
                value={this.state.predicate}
                onChange={this.changePredicate}
              />
            </p>
            <label className="label">Object</label>
            <p className="control">
              <span className="select">
                <select onChange={this.targetSelected}>
                  {this.props.allNodes
                    .filter(p => p.id != this.props.selectedNode.id)
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.id}
                      </option>
                    ))}
                </select>
              </span>
            </p>
          </section>
          <footer className="modal-card-foot">
            <a className="button is-primary" onClick={this.onConnectClick}>
              Connect
            </a>
            <a className="button" onClick={this.props.onClose}>
              Cancel
            </a>
          </footer>
        </div>
      </div>
    );
  }
}
