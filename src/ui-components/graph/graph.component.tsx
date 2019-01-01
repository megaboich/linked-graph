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
import {
  GraphDndHelper,
  buildTouchInfoFromMouseEvent,
  buildTouchInfo
} from "./graph-dnd-helper";

import "./graph.component.less";

export interface State {}

export interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNode?: GraphNode;
  onSelectNode(node?: GraphNode): void;
  onNodeDoubleTap?(node: GraphNode): void;
  drawLinkText: boolean;
  drawLinkArrows: boolean;
  drawRulerGrid: boolean;
  useForce: boolean;
  forceLinkLength: number;
}

export class GraphComponent extends Component<Props, State> {
  private readonly layout = new GraphColaLayout(() => this.forceUpdate());
  private readonly componentId = "graph-component-" + getRandomWord(16);
  private readonly dndHelper = new GraphDndHelper();

  constructor(props: Props) {
    super(props);
    this.state = { width: 0, height: 0, offsetX: 0, offsetY: 0 };
  }

  componentDidMount() {
    const dimensions = this.getParentContainerDimensions();
    this.setState(dimensions);
    this.dndHelper.initView(dimensions);
    this.layout.init({
      width: this.dndHelper.width,
      height: this.dndHelper.height,
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
        width: this.dndHelper.width,
        height: this.dndHelper.height,
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
    const dimensions = this.getParentContainerDimensions();
    this.dndHelper.changeView(dimensions);
    this.setState(dimensions);
    this.layout.size([dimensions.width, dimensions.height]).triggerLayout();
  };

  handleNodeTouchStart = (
    node: GraphNode,
    clientX: number,
    clientY: number
  ) => {
    this.props.onSelectNode(node);
    this.dndHelper.addNodeTouch(node, { clientX, clientY });
  };

  handleGraphMouseDown = (e: MouseEvent) => {
    this.dndHelper.addTouch(buildTouchInfoFromMouseEvent(e));
    this.props.onSelectNode(undefined);
  };

  handleGraphTouchStart = (e: TouchEvent) => {
    this.dndHelper.addTouch(buildTouchInfo(e.changedTouches));
    this.props.onSelectNode(undefined);
  };

  handleGraphTouchEnd = (e: TouchEvent) => {
    this.dndHelper.endTouch(buildTouchInfo(e.changedTouches));
    this.layout.triggerLayout();
  };

  handleGraphMouseUp = () => {
    this.dndHelper.endTouchById([0]);
    this.layout.triggerLayout();
  };

  handleGraphMouseMove = (e: MouseEvent) => {
    const needToUpdateLayout = this.dndHelper.moveTouch(
      buildTouchInfoFromMouseEvent(e)
    );
    if (needToUpdateLayout) {
      this.layout.triggerLayout();
    }
    this.forceUpdate();
  };

  handleGraphTouchMove = (e: TouchEvent) => {
    const needToUpdateLayout = this.dndHelper.moveTouch(
      buildTouchInfo(e.changedTouches)
    );
    if (needToUpdateLayout) {
      this.layout.triggerLayout();
    }
    this.forceUpdate();
  };

  handleGraphWheel = (e: WheelEvent) => {
    let zoomFactor = (e.deltaZ || e.deltaY) / 200;
    zoomFactor = Math.max(-1, zoomFactor);
    zoomFactor = Math.min(1, zoomFactor);
    this.dndHelper.zoom(zoomFactor, e.clientX, e.clientY);
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

  getParentContainerDimensions() {
    const componentDomElement = document.getElementById(this.componentId);
    if (!componentDomElement) {
      throw new Error("Can't locate graph root DOM element");
    }
    const containerElement = ensure(componentDomElement.parentElement);
    const rect = containerElement.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      offsetX: rect.left,
      offsetY: rect.top
    };
  }

  render() {
    const { cameraZoom, cameraX, cameraY, width, height } = this.dndHelper;
    const translateX = cameraX / cameraZoom - width;
    const translateY = cameraY / cameraZoom - height;

    return (
      <div
        id={this.componentId}
        className={cn("graph-component", {
          "is-mouse-down": this.dndHelper.dragCameraActive
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
            onTouchStart={this.handleGraphTouchStart}
            onTouchMove={this.handleGraphTouchMove}
            onTouchEnd={this.handleGraphTouchEnd}
            onTouchCancel={this.handleGraphTouchEnd}
          >
            <defs>
              <marker
                id="marker-arrowend"
                viewBox="0 -5 10 10"
                refX="19"
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
                {this.props.drawRulerGrid && (
                  <GridComponent
                    centerX={width / 2}
                    centerY={height / 2}
                    step={100}
                    count={20}
                  />
                )}
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
