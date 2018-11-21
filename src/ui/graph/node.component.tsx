import { h, Component } from "preact";
import * as cn from "classnames";
import { GraphNode } from "src/graph/objects";

export interface State {}

export interface Props {
  node: GraphNode;
  onNodeClick(node: GraphNode): void;
}

export class NodeComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleNodeClick = () => {
    this.props.onNodeClick(this.props.node);
  };

  render() {
    const node = this.props.node;
    return (
      <g
        transform={`translate(${node.x}, ${node.y})`}
        className={cn("graph-node", {
          "is-selected": this.props.node.selected
        })}
        onClick={this.handleNodeClick}
      >
        <circle r="5">
          <title>{node.label}</title>
        </circle>
        <text x="0" y="20">
          {node.label}
        </text>
      </g>
    );
  }
}
