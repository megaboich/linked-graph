import * as React from "react";

import { NavbarComponent } from "./common/navbar.component";
import { GraphNode, GraphLink } from "src/graph/objects";
import { getRandomWord, getRandomNumber } from "src/helpers/random";
import { GraphComponent } from "./graph/graph.component";

export interface State {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface Props {}

export class MainComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { nodes: [], links: [] };
  }

  addNewRandomNode() {
    const randomId = getRandomWord(6);
    const newNode = {
      id: randomId,
      label: randomId,
      x: getRandomNumber(10, 590),
      y: getRandomNumber(10, 390)
    };
    const newNodes = [...this.state.nodes, newNode];
    const newLinks = [...this.state.links];

    if (newNodes.length >= 2) {
      const prevNode = newNodes[newNodes.length - 2];
      const newLink: GraphLink = {
        source: prevNode,
        target: newNode,
        id: prevNode.id + " - " + newNode.id
      };
      newLinks.push(newLink);
    }

    this.setState({
      nodes: newNodes,
      links: newLinks
    });
  }

  onNewNodeClick = () => {
    this.addNewRandomNode();
  };

  onDeleteNodeClick = () => {
    if (this.state.nodes.length > 0) {
      const nodeId = this.state.nodes[0].id;
      const newNodes = this.state.nodes.filter(x => x.id != nodeId);
      const newLinks = this.state.links.filter(
        x => x.source.id != nodeId && x.target.id != nodeId
      );
      this.setState({
        nodes: newNodes,
        links: newLinks
      });
    }
  };

  onShakeBtnClick = async () => {
    const newNodes = [...this.state.nodes];
    for (let node of newNodes) {
      node.x = (node.x || 0) + getRandomNumber(-100, 100);
      node.y = (node.y || 0) + getRandomNumber(-100, 100);
    }
    this.setState({
      nodes: newNodes
    });
  };

  render() {
    return (
      <>
        <NavbarComponent
          brandContent={<span className="navbar-item">Linked graph</span>}
        >
          <div className="navbar-end">
            <a className="navbar-item" href="#" onClick={this.onNewNodeClick}>
              New node
            </a>
            <a
              className="navbar-item"
              href="#"
              onClick={this.onDeleteNodeClick}
            >
              Delete node
            </a>
            <a className="navbar-item" href="#" onClick={this.onShakeBtnClick}>
              Shake
            </a>
          </div>
        </NavbarComponent>
        <GraphComponent nodes={this.state.nodes} links={this.state.links} />
      </>
    );
  }
}
