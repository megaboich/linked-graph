import * as React from "react";
import { GraphNode } from "src/graph/objects";

export interface State {}

export interface Props {
  node: GraphNode;
}

export class NodeComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const node = this.props.node;
    return (
      <g transform={`translate(${node.x}, ${node.y})`} className="graph-node">
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
