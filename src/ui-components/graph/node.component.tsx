import * as React from "react";
import { Component, MouseEvent } from "react";
import * as cn from "classnames";
import { GraphNode } from "./graph-objects";

export interface State {}

export interface Props {
  node: GraphNode;
  isSelected?: boolean;
  onNodeMouseDown(node: GraphNode, e: MouseEvent): void;
  onNodeDoubleClick?(node: GraphNode, e: MouseEvent): void;
}

export class NodeComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleMouseDown = (e: MouseEvent<SVGGElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onNodeMouseDown(this.props.node, e);
  };

  handleDoubleClick = (e: MouseEvent<SVGGElement>) => {
    if (this.props.onNodeDoubleClick) {
      this.props.onNodeDoubleClick(this.props.node, e);
    }
  };

  render() {
    const node = this.props.node;
    const text = node.label || node.id;
    const nodeX = Math.round(node.x);
    const nodeY = Math.round(node.y);
    return (
      <g
        className={cn("graph-node", {
          "is-selected": this.props.isSelected
        })}
        transform={`translate(${nodeX}, ${nodeY})`}
        onMouseDown={this.handleMouseDown}
        onDoubleClick={this.handleDoubleClick}
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
