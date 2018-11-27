import { h, Component } from "preact";
import * as cn from "classnames";
import { GraphNode, GraphLink } from "./graph-objects";
import { NodeComponent } from "./node.component";
import { LinkComponent } from "./link.component";
import { GraphColaLayout } from "./graph-cola-layout";

import "./graph.component.less";

export interface State {
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
  width: number;
  height: number;
  selectedNode?: GraphNode;
  onSelectNode(node?: GraphNode): void;
}

export class GraphComponent extends Component<Props, State> {
  private layout = new GraphColaLayout(() => this.forceUpdate());

  constructor(props: Props) {
    super(props);
    this.state = {
      cameraX: props.width / 2,
      cameraY: props.height / 2,
      cameraZoom: 1
    };
  }

  componentDidMount() {
    this.layout.init({
      width: this.props.width,
      height: this.props.height,
      nodes: this.props.nodes,
      links: this.props.links,
      firstInit: true
    });
  }

  componentWillReceiveProps(newProps: Props) {
    if (
      newProps.nodes !== this.props.nodes ||
      newProps.links !== this.props.links
    ) {
      this.layout.init({
        width: newProps.width,
        height: newProps.height,
        nodes: newProps.nodes,
        links: newProps.links,
        firstInit: false
      });
    }
  }

  componentWillUnmount() {
    this.layout.stop();
    this.layout.clearTimer();
  }

  handleNodeMouseDown = (node: GraphNode, e: MouseEvent) => {
    this.props.onSelectNode(node);

    this.setState({
      dragNode: node,
      dragStartNodeX: node.x,
      dragStartNodeY: node.y,
      dragStartNodeMouseX: e.x,
      dragStartNodeMouseY: e.y
    });
  };

  handleGraphMouseDown = (e: MouseEvent) => {
    this.props.onSelectNode(undefined);

    this.setState({
      mouseDown: true,
      dragNode: undefined,
      dragStartCameraX: this.state.cameraX,
      dragStartCameraY: this.state.cameraY,
      dragStartCameraMouseX: e.x,
      dragStartCameraMouseY: e.y
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

  handleGraphMouseMove = (e: MouseEvent) => {
    const dragNode = this.state.dragNode;
    if (dragNode) {
      const dx = (this.state.dragStartNodeMouseX || 0) - e.x;
      const dy = (this.state.dragStartNodeMouseY || 0) - e.y;
      dragNode.x =
        (this.state.dragStartNodeX || 0) - dx / this.state.cameraZoom;
      dragNode.y =
        (this.state.dragStartNodeY || 0) - dy / this.state.cameraZoom;
      dragNode.px = dragNode.x;
      dragNode.py = dragNode.y;
      dragNode.fixed = 1;
      this.layout.triggerLayout();
    } else if (this.state.mouseDown) {
      const dx = (this.state.dragStartCameraMouseX || 0) - e.x;
      const dy = (this.state.dragStartCameraMouseY || 0) - e.y;
      this.setState({
        cameraX: (this.state.dragStartCameraX || 0) - dx,
        cameraY: (this.state.dragStartCameraY || 0) - dy
      });
    }
  };

  handleGraphWheel = (e: WheelEvent) => {
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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.layout.isLayoutCalculated ? true : false;
  }

  render() {
    const { width, height } = this.props;
    const { cameraZoom, cameraX, cameraY } = this.state;
    const translateX = Math.round(cameraX / cameraZoom - width);
    const translateY = Math.round(cameraY / cameraZoom - height);

    return (
      <div
        className={cn("graph-container", {
          "is-mouse-down": this.state.mouseDown
        })}
      >
        {this.layout.isLayoutCalculated ? (
          <svg
            style={{ width, height }}
            onMouseDown={this.handleGraphMouseDown}
            onMouseMove={this.handleGraphMouseMove}
            onMouseUp={this.handleGraphMouseUp}
            onMouseLeave={this.handleGraphMouseUp}
            onWheel={this.handleGraphWheel}
          >
            <g
              transform={`scale(${cameraZoom}) translate(${translateX}, ${translateY})`}
            >
              <g transform={`translate(${width / 2}, ${height / 2})`}>
                {this.props.links.map(link => (
                  <LinkComponent
                    key={link.source.id + "-" + link.target.id}
                    link={link}
                  />
                ))}
                {this.props.nodes.map(node => (
                  <NodeComponent
                    key={node.id}
                    node={node}
                    onNodeMouseDown={this.handleNodeMouseDown}
                    isSelected={this.props.selectedNode === node}
                  />
                ))}
              </g>
            </g>
          </svg>
        ) : (
          <span />
        )}
      </div>
    );
  }
}
