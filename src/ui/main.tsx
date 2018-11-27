import { h, Component } from "preact";

import { GraphVertex, GraphEdge } from "src/services/graph-model";
import { NavbarComponent } from "./common/navbar.component";
import { GraphNode } from "./graph/graph-objects";
import { GraphComponent } from "./graph/graph.component";

export interface Props {
  selectedVertex?: GraphVertex;
  vertices: GraphVertex[];
  edges: GraphEdge[];
  selectVertex(vertex?: GraphVertex): void;
  addVertex(): void;
  removeVertex(): void;
}

export interface State {}

export class MainComponent extends Component<Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleNewNodeClick = () => {
    this.props.addVertex();
  };

  handleDeleteNodeClick = () => {
    this.props.removeVertex();
  };

  handleOnSelectNode = (node?: GraphNode) => {
    this.props.selectVertex(node);
  };

  render() {
    return (
      <div>
        <NavbarComponent
          brandContent={<span className="navbar-item">Linked graph</span>}
          menuContent={
            <div className="navbar-end">
              <a
                className="navbar-item"
                href="#"
                onClick={this.handleNewNodeClick}
              >
                New node
              </a>
              <a
                className="navbar-item"
                href="#"
                onClick={this.handleDeleteNodeClick}
              >
                Delete node
              </a>
            </div>
          }
        />
        <GraphComponent
          width={1000}
          height={800}
          nodes={this.props.vertices}
          links={this.props.edges}
          selectedNode={this.props.selectedVertex}
          onSelectNode={this.handleOnSelectNode}
        />
      </div>
    );
  }
}
