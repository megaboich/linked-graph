import * as React from "react";
import { Component, MouseEvent, WheelEvent, TouchEvent } from "react";
import * as cn from "classnames";
import { ensure } from "src/helpers/syntax";
import { getRandomWord } from "src/helpers/random";

import { GraphNode, GraphLink } from "./graph-objects";
import { GridComponent } from "./grid.component";
import { NodeComponent } from "./node.component";
import { LinkComponent } from "./link.component";
import { LinkTextComponent } from "./link-text.component";
import { GraphColaLayout } from "./graph-cola-layout";
import { GraphDndHelper } from "./graph-dnd-helper";

import "./graph.component.less";

export interface State {
  width: number;
  height: number;
}

export interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNode?: GraphNode;
  onSelectNode(node?: GraphNode): void;
  onNodeDoubleTap?(node: GraphNode): void;
  drawLinkText: boolean;
  drawLinkArrows: boolean;
  useForce: boolean;
  forceLinkLength: number;
}

export class GraphComponent extends Component<Props, State> {
  private readonly layout = new GraphColaLayout(() => this.forceUpdate());
  private readonly componentId = "graph-component-" + getRandomWord(16);
  private readonly cameraDndHelper = new GraphDndHelper();

  constructor(props: Props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }

  componentDidMount() {
    const { width, height } = this.getParentContainerDimensions();
    this.setState({ width, height });
    this.cameraDndHelper.initViewSize(width, height);
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
    this.cameraDndHelper.handleViewResize(width, height);
    this.setState({ width, height });
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

  handleNodeTouchStart = (
    node: GraphNode,
    clientX: number,
    clientY: number
  ) => {
    this.props.onSelectNode(node);
    this.cameraDndHelper.startNodeDrag(node, clientX, clientY);
  };

  handleGraphMouseDown = (e: MouseEvent<SVGGElement>) => {
    this.props.onSelectNode(undefined);
    this.cameraDndHelper.startCameraDrag(e.clientX, e.clientY);
  };

  handleGraphTouchStart = (e: TouchEvent<SVGGElement>) => {
    if (e.changedTouches.length > 0) {
      this.props.onSelectNode(undefined);
      this.cameraDndHelper.startCameraDrag(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
    }
  };

  handleGraphMouseUpOrTouchEnd = () => {
    this.cameraDndHelper.stopDrag();
    this.layout.triggerLayout();
  };

  handleGraphMouseMove = (e: MouseEvent<SVGGElement>) => {
    if (this.cameraDndHelper.doDrag(e.clientX, e.clientY)) {
      this.layout.triggerLayout();
    }
    this.forceUpdate();
  };

  handleGraphTouchMove = (e: TouchEvent<SVGGElement>) => {
    if (e.changedTouches.length > 0) {
      if (
        this.cameraDndHelper.doDrag(
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY
        )
      ) {
        this.layout.triggerLayout();
      }
      this.forceUpdate();
    }
  };

  handleGraphWheel = (e: WheelEvent<SVGGElement>) => {
    // console.log("wheel!", e.clientX, e.clientY);
    let zoomFactor = (e.deltaZ || e.deltaY) / 200;
    zoomFactor = Math.max(-1, zoomFactor);
    zoomFactor = Math.min(1, zoomFactor);
    this.cameraDndHelper.zoom(zoomFactor);
    this.forceUpdate();
  };

  handleNodeDoubleTap = (node: GraphNode) => {
    if (this.props.onNodeDoubleTap) {
      this.props.onNodeDoubleTap(node);
    }
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.layout.isLayoutCalculated ? true : false;
  }

  render() {
    const { width, height } = this.state;
    const { cameraZoom, cameraX, cameraY } = this.cameraDndHelper;
    const translateX = Math.round(cameraX / cameraZoom - width);
    const translateY = Math.round(cameraY / cameraZoom - height);

    return (
      <div
        id={this.componentId}
        className={cn("graph-component", {
          "is-mouse-down": this.cameraDndHelper.mouseDown
        })}
      >
        {this.layout.isLayoutCalculated && (
          <svg
            style={{ width, height }}
            onMouseDown={this.handleGraphMouseDown}
            onMouseMove={this.handleGraphMouseMove}
            onMouseUp={this.handleGraphMouseUpOrTouchEnd}
            onMouseLeave={this.handleGraphMouseUpOrTouchEnd}
            onWheel={this.handleGraphWheel}
            onTouchStart={this.handleGraphTouchStart}
            onTouchMove={this.handleGraphTouchMove}
            onTouchEnd={this.handleGraphMouseUpOrTouchEnd}
            onTouchCancel={this.handleGraphMouseUpOrTouchEnd}
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
                <GridComponent
                  centerX={width / 2}
                  centerY={height / 2}
                  step={100}
                  count={4}
                />
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
                    onNodeTouchStart={this.handleNodeTouchStart}
                    onNodeDoubleTap={this.handleNodeDoubleTap}
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
