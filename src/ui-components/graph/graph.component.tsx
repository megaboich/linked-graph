import * as React from "react";
import { Component, MouseEvent, WheelEvent } from "react";
import * as cn from "classnames";
import { ensure } from "src/helpers/syntax";
import { getRandomWord } from "src/helpers/random";

import { GraphNode, GraphLink } from "./graph-objects";
import { NodeComponent } from "./node.component";
import { LinkComponent } from "./link.component";
import { LinkTextComponent } from "./link-text.component";
import { GraphColaLayout } from "./graph-cola-layout";

import "./graph.component.less";

export interface State {
  width: number;
  height: number;
  cameraX: number;
  cameraY: number;
  cameraZoom: number;
  dragStartCameraX?: number;
  dragStartCameraY?: number;
  dragStartCameraMouseX?: number;
  dragStartCameraMouseY?: number;
  mouseDown?: boolean;

  dragNode?: GraphNode;
  dragStartNodeX?: number;
  dragStartNodeY?: number;
  dragStartNodeMouseX?: number;
  dragStartNodeMouseY?: number;
}

export interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNode?: GraphNode;
  onSelectNode(node?: GraphNode): void;
  onDoubleClickNode?(node: GraphNode): void;
  drawLinkText: boolean;
  drawLinkArrows: boolean;
  useForce: boolean;
  forceLinkLength: number;
}

export class GraphComponent extends Component<Props, State> {
  private layout = new GraphColaLayout(() => this.forceUpdate());
  private readonly componentId = "graph-component-" + getRandomWord(16);

  constructor(props: Props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      cameraX: 0,
      cameraY: 0,
      cameraZoom: 1
    };
  }

  componentDidMount() {
    const { width, height } = this.getParentContainerDimensions();

    this.setState({
      width,
      height,
      cameraX: width / 2,
      cameraY: height / 2
    });

    this.layout.init({
      width,
      height,
      nodes: this.props.nodes,
      links: this.props.links,
      enable: this.props.useForce,
      forceLinkLength: this.props.forceLinkLength
    });

    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillReceiveProps(newProps: Props) {
    if (
      newProps.nodes !== this.props.nodes ||
      newProps.links !== this.props.links ||
      newProps.useForce !== this.props.useForce ||
      newProps.forceLinkLength !== this.props.forceLinkLength
    ) {
      this.layout.init({
        width: this.state.width,
        height: this.state.height,
        nodes: newProps.nodes,
        links: newProps.links,
        enable: newProps.useForce,
        forceLinkLength: newProps.forceLinkLength
      });
    }
  }

  componentWillUnmount() {
    this.layout.stop();
    this.layout.clearTimer();
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    const { width, height } = this.getParentContainerDimensions();
    const dx = (this.state.width - width) * this.state.cameraZoom;
    const dy = (this.state.height - height) * this.state.cameraZoom;
    this.setState({
      width,
      height,
      cameraX: this.state.cameraX - dx,
      cameraY: this.state.cameraY - dy
    });
    this.layout.size([width, height]).triggerLayout();
  };

  getParentContainerDimensions() {
    const componentDomElement = document.getElementById(this.componentId);
    if (!componentDomElement) {
      throw new Error("Can't locate graph root DOM element");
    }
    const containerElement = ensure(componentDomElement.parentElement);
    const rect = containerElement.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }

  handleNodeMouseDown = (node: GraphNode, e: MouseEvent<SVGGElement>) => {
    this.props.onSelectNode(node);

    this.setState({
      dragNode: node,
      dragStartNodeX: node.x,
      dragStartNodeY: node.y,
      dragStartNodeMouseX: e.clientX,
      dragStartNodeMouseY: e.clientY
    });
  };

  handleGraphMouseDown = (e: MouseEvent<SVGGElement>) => {
    this.props.onSelectNode(undefined);

    this.setState({
      mouseDown: true,
      dragNode: undefined,
      dragStartCameraX: this.state.cameraX,
      dragStartCameraY: this.state.cameraY,
      dragStartCameraMouseX: e.clientX,
      dragStartCameraMouseY: e.clientY
    });
  };

  handleGraphMouseUp = () => {
    const dragNode = this.state.dragNode;
    if (dragNode) {
      dragNode.fixed = 0;
      this.layout.triggerLayout();
    }
    this.setState({
      mouseDown: false,
      dragNode: undefined
    });
  };

  handleGraphMouseMove = (e: MouseEvent<SVGGElement>) => {
    const dragNode = this.state.dragNode;
    if (dragNode) {
      const dx = (this.state.dragStartNodeMouseX || 0) - e.clientX;
      const dy = (this.state.dragStartNodeMouseY || 0) - e.clientY;
      dragNode.x =
        (this.state.dragStartNodeX || 0) - dx / this.state.cameraZoom;
      dragNode.y =
        (this.state.dragStartNodeY || 0) - dy / this.state.cameraZoom;
      dragNode.px = dragNode.x;
      dragNode.py = dragNode.y;
      dragNode.fixed = 1;
      this.forceUpdate();
      this.layout.triggerLayout();
    } else if (this.state.mouseDown) {
      const dx = (this.state.dragStartCameraMouseX || 0) - e.clientX;
      const dy = (this.state.dragStartCameraMouseY || 0) - e.clientY;
      this.setState({
        cameraX: (this.state.dragStartCameraX || 0) - dx,
        cameraY: (this.state.dragStartCameraY || 0) - dy
      });
    }
  };

  handleGraphWheel = (e: WheelEvent<SVGGElement>) => {
    let zoomFactor = (e.deltaZ || e.deltaY) / 200;
    zoomFactor = Math.max(-1, zoomFactor);
    zoomFactor = Math.min(1, zoomFactor);
    let newScale =
      Math.round(this.state.cameraZoom * (1 - zoomFactor) * 1000) / 1000;
    newScale = Math.max(0.1, newScale);
    newScale = Math.min(10, newScale);
    this.setState({
      cameraZoom: newScale
    });
  };

  handleNodeDoubleClick = (node: GraphNode) => {
    if (this.props.onDoubleClickNode) {
      this.props.onDoubleClickNode(node);
    }
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.layout.isLayoutCalculated ? true : false;
  }

  render() {
    const { width, height } = this.state;
    const { cameraZoom, cameraX, cameraY } = this.state;
    const translateX = Math.round(cameraX / cameraZoom - width);
    const translateY = Math.round(cameraY / cameraZoom - height);

    return (
      <div
        id={this.componentId}
        className={cn("graph-component", {
          "is-mouse-down": this.state.mouseDown
        })}
      >
        {this.layout.isLayoutCalculated && (
          <svg
            style={{ width, height }}
            onMouseDown={this.handleGraphMouseDown}
            onMouseMove={this.handleGraphMouseMove}
            onMouseUp={this.handleGraphMouseUp}
            onMouseLeave={this.handleGraphMouseUp}
            onWheel={this.handleGraphWheel}
          >
            <defs>
              <marker
                id="marker-arrowend"
                viewBox="0 -5 10 10"
                refX="21"
                refY="0"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0,-4L10,0L0,4" />
              </marker>
            </defs>
            <g
              transform={`scale(${cameraZoom}) translate(${translateX}, ${translateY})`}
            >
              <g transform={`translate(${width / 2}, ${height / 2})`}>
                {this.props.drawLinkText
                  ? this.props.links.map(link => (
                      <LinkTextComponent
                        key={link.source.id + "-" + link.target.id}
                        link={link}
                        drawArrow={this.props.drawLinkArrows}
                      />
                    ))
                  : this.props.links.map(link => (
                      <LinkComponent
                        key={link.source.id + "-" + link.target.id}
                        link={link}
                        drawArrow={this.props.drawLinkArrows}
                      />
                    ))}

                {this.props.nodes.map(node => (
                  <NodeComponent
                    key={node.id}
                    node={node}
                    onNodeMouseDown={this.handleNodeMouseDown}
                    onNodeDoubleClick={this.handleNodeDoubleClick}
                    isSelected={this.props.selectedNode === node}
                  />
                ))}
              </g>
            </g>
          </svg>
        )}
      </div>
    );
  }
}
