import { h, Component } from "preact";
import * as cn from "classnames";
import { GraphNode } from "src/ui/graph/objects";

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

  handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onNodeClick(this.props.node);
  };

  render() {
    const node = this.props.node;
    const text = node.label || node.id;
    const nodeX = Math.round(node.x);
    const nodeY = Math.round(node.y);
    return (
      <g
        transform={`translate(${nodeX}, ${nodeY})`}
        className={cn("graph-node", {
          "is-selected": this.props.node.selected
        })}
        onMouseDown={this.handleMouseDown}
      >
        <circle r="5">
          <title>{text}</title>
        </circle>
        <text x="0" y="20">
          {text}
        </text>
      </g>
    );
  }
}
