import * as React from "react";
import { ApplicationState } from "../app-state";
import { GraphLink, GraphNode } from "../graph/graph-data";
import { ConnectModalComponent } from "./connect-modal";

export interface IControlPanelState {
  newNodeName?: string;
  selectedNode?: GraphNode;
  selectedNodeLinks?: GraphLink[];
  isConnectModalActive?: boolean;
}

export interface IControlPanelProps {
  appState: ApplicationState;
}

export class ControlPanelComponent extends React.Component<
  IControlPanelProps,
  IControlPanelState
> {
  constructor(props: IControlPanelProps) {
    super(props);
    this.state = {
      newNodeName: ""
    };
  }

  componentDidMount() {
    this.props.appState.selectedNodeSubject.subscribe(node => {
      this.setState({
        selectedNode: node,
        selectedNodeLinks: this.props.appState.getConnectionsForNode(node)
      });
    });
  }

  changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newNodeName: e.target.value });
  };

  addNode = () => {
    if (this.state.newNodeName) {
      this.props.appState.addNode(this.state.newNodeName);
      this.setState({ newNodeName: "" });
    }
  };

  selectNode = (node: GraphNode) => {
    this.props.appState.selectNode(node);
  };

  showConnectModal = () => {
    this.setState({
      isConnectModalActive: !this.state.isConnectModalActive
    });
  };

  onAddNewLink = (newLink: GraphLink) => {
    if (newLink.source && newLink.target) {
      this.props.appState.addLink(newLink);
      this.selectNode(newLink.source);
    } else {
      throw "wrong link to add";
    }
  };

  render() {
    return (
      <div>
        {this.getNewNodeSectionMarkUp()}
        {this.getSelectedNodeSectionMarkup()}
        {this.state.selectedNode && (
          <ConnectModalComponent
            selectedNode={this.state.selectedNode}
            allNodes={this.props.appState.graph.nodes}
            isActive={this.state.isConnectModalActive}
            onClose={() => this.showConnectModal()}
            onAddLink={this.onAddNewLink}
          />
        )}
      </div>
    );
  }

  getNewNodeSectionMarkUp() {
    return (
      <div className="box">
        <p className="control has-addons">
          <input
            className="input"
            type="text"
            placeholder="New node name"
            value={this.state.newNodeName}
            onChange={this.changeName}
          />
          <a className="button is-info" onClick={this.addNode}>
            Add
          </a>
        </p>
      </div>
    );
  }

  getSelectedNodeSectionMarkup() {
    if (!this.state.selectedNode) {
      return <></>;
    }
    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">{this.state.selectedNode.id}</p>
        </header>

        <div className="card-content">
          <div className="content">
            {this.state.selectedNodeLinks &&
              this.state.selectedNodeLinks.map(l => this.getLinkMarkup(l))}
          </div>
        </div>

        <footer className="card-footer">
          <a className="card-footer-item" onClick={this.showConnectModal}>
            Connect
          </a>
          <a className="card-footer-item">Edit</a>
          <a className="card-footer-item">Delete</a>
        </footer>
      </div>
    );
  }

  getLinkMarkup(link: GraphLink) {
    return (
      <p key={this.props.appState.graph.getLinkKey(link)}>
        {this.getNodeLinkMarkup(link.source)} {link.predicate}{" "}
        {this.getNodeLinkMarkup(link.target)}
      </p>
    );
  }

  getNodeLinkMarkup(node: GraphNode) {
    if (this.state.selectedNode && this.state.selectedNode.id == node.id) {
      return <span className="has-text-weight-semibold">{node.id}</span>;
    } else {
      return (
        <a href="javascript:void(0)" onClick={() => this.selectNode(node)}>
          {node.id}
        </a>
      );
    }
  }
}
