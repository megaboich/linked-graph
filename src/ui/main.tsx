import { h, Component } from "preact";

import { NavbarComponent } from "./common/navbar.component";
import { GraphNode, GraphLink } from "src/ui/graph/objects";
import {
  getRandomWord,
  getRandomNumber,
  getRandomName
} from "src/helpers/random";
import { GraphComponent } from "./graph/graph.component";
import { getInitialGraph } from "./services/data-loader";

export interface State {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface Props {}

export class MainComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { ...getInitialGraph() };
  }

  onNewNodeClick = () => {
    const prevNode =
      this.state.nodes.length >= 1
        ? this.state.nodes.find(n => !!n.selected) ||
          this.state.nodes[this.state.nodes.length - 1]
        : undefined;

    const randomId = getRandomName();
    const newNode: GraphNode = {
      id: randomId,
      label: randomId,
      x: prevNode
        ? prevNode.x + getRandomNumber(-50, 50)
        : getRandomNumber(10, 590),
      y: prevNode
        ? prevNode.y + getRandomNumber(-50, 50)
        : getRandomNumber(10, 390)
    };
    const newNodes = [...this.state.nodes, newNode];
    const newLinks = [...this.state.links];

    if (newNodes.length >= 2) {
      const prevNode =
        newNodes.find(n => !!n.selected) || newNodes[newNodes.length - 2];
      const newLink: GraphLink = {
        source: prevNode,
        target: newNode
      };
      newLinks.push(newLink);
    }

    this.setState({
      nodes: newNodes,
      links: newLinks
    });
  };

  onDeleteNodeClick = () => {
    if (this.state.nodes.length > 0) {
      const nodeToDelete =
        this.state.nodes.find(n => !!n.selected) || this.state.nodes[0];
      const nodeIdToDelete = nodeToDelete.id;
      const newNodes = this.state.nodes.filter(x => x.id != nodeIdToDelete);
      const newLinks = this.state.links.filter(
        x => x.source.id != nodeIdToDelete && x.target.id != nodeIdToDelete
      );
      this.setState({
        nodes: newNodes,
        links: newLinks
      });
    }
  };

  render() {
    return (
      <div>
        <NavbarComponent
          brandContent={<span className="navbar-item">Linked graph</span>}
          menuContent={
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
            </div>
          }
        />
        <GraphComponent
          width={1000}
          height={800}
          nodes={this.state.nodes}
          links={this.state.links}
        />
      </div>
    );
  }
}
