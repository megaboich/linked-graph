import * as React from "react";
import { Component, MouseEvent, TouchEvent } from "react";
import * as cn from "classnames";
import { GraphNode } from "./graph-objects";

let lastTapTime = new Date().getTime();

export interface State {}

export interface Props {
  node: GraphNode;
  isSelected?: boolean;
  onNodeTouchStart(node: GraphNode, clientX: number, clientY: number): void;
  onNodeDoubleTap?(node: GraphNode): void;
}

export class NodeComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleMouseDown = (e: MouseEvent<SVGGElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onNodeTouchStart(this.props.node, e.clientX, e.clientY);
  };

  handleTouchStart = (e: TouchEvent<SVGGElement>) => {
    if (e.changedTouches.length > 0) {
      e.stopPropagation();
      const now = new Date().getTime();
      if (now - lastTapTime < 500) {
        // We have double tap here
        setTimeout(() => {
          /**
           * Timeout is needed to allow browser finish all events like TouchEnd, etc
           * preventDefault is not working here
           */
          if (this.props.onNodeDoubleTap) {
            this.props.onNodeDoubleTap(this.props.node);
          }
        }, 100);
      } else {
        this.props.onNodeTouchStart(
          this.props.node,
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY
        );
      }
      lastTapTime = now;
    }
  };

  handleDoubleClick = (e: MouseEvent<SVGGElement>) => {
    if (this.props.onNodeDoubleTap) {
      this.props.onNodeDoubleTap(this.props.node);
    }
  };

  render() {
    const node = this.props.node;
    const text = node.label;
    const nodeX = Math.round(node.x);
    const nodeY = Math.round(node.y);
    return (
      <g
        className={cn("graph-node", {
          "is-selected": this.props.isSelected
        })}
        transform={`translate(${nodeX}, ${nodeY})`}
        onTouchStart={this.handleTouchStart}
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
