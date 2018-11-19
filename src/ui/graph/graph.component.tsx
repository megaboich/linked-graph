import * as React from "react";
import { GraphNode, GraphLink } from "src/graph/objects";
import { NodeComponent } from "./node.component";
import { LinkComponent } from "./link.component";
import { GraphColaLayout } from "./graph-cola-layout";

import "./graph.component.less";

export interface State {}

export interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
}

export class GraphComponent extends React.Component<Props, State> {
  private layout = new GraphColaLayout(() => this.forceUpdate());

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.layout.init(this.props.nodes, this.props.links);
  }

  componentWillReceiveProps(newProps: Props) {
    if (
      newProps.nodes !== this.props.nodes ||
      newProps.links !== this.props.links
    ) {
      this.layout.init(newProps.nodes, newProps.links);
    }
  }

  componentWillUnmount() {
    this.layout.stop();
  }

  render() {
    return (
      <div className="graph-container">
        <svg style={{ width: 600, height: 400 }}>
          <g>
            <g stroke={"#999"}>
              {this.props.links.map(link => (
                <LinkComponent key={link.id} link={link} />
              ))}
            </g>
            {this.props.nodes.map(node => (
              <NodeComponent key={node.id} node={node} />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}
