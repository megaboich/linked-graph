import { h, Component } from "preact";
import * as cn from "classnames";
import { GraphNode, GraphLink } from "./objects";
import { NodeComponent } from "./node.component";
import { LinkComponent } from "./link.component";
import { GraphColaLayout } from "./graph-cola-layout";

import "./graph.component.less";

export interface State {
  cameraX: number;
  cameraY: number;
  cameraZoom: number;
  cameraDragStartX: number;
  cameraDragStartY: number;
  mouseDragStartClientX: number;
  mouseDragStartClientY: number;
  mouseDown?: boolean;
}

export interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  width: number;
  height: number;
}

export class GraphComponent extends Component<Props, State> {
  private layout = new GraphColaLayout(() => this.forceUpdate());

  constructor(props: Props) {
    super(props);
    this.state = {
      cameraX: props.width / 2,
      cameraY: props.height / 2,
      cameraZoom: 1,
      cameraDragStartX: 0,
      cameraDragStartY: 0,
      mouseDragStartClientX: 0,
      mouseDragStartClientY: 0
    };
  }

  componentDidMount() {
    this.layout.init(
      { width: this.props.width, height: this.props.height },
      this.props.nodes,
      this.props.links
    );
  }

  componentWillReceiveProps(newProps: Props) {
    if (
      newProps.nodes !== this.props.nodes ||
      newProps.links !== this.props.links
    ) {
      this.layout.init(
        { width: this.props.width, height: this.props.height },
        newProps.nodes,
        newProps.links
      );
    }
  }

  componentWillUnmount() {
    this.layout.stop();
    this.layout.clearTimer();
  }

  handleNodeClick = (node: GraphNode) => {
    console.log("Node click!", node);
    for (const n of this.props.nodes) {
      n.selected = false;
    }
    node.selected = true;
    this.forceUpdate();
  };

  mouseDown = (e: MouseEvent) => {
    this.setState({
      mouseDown: true,
      cameraDragStartX: this.state.cameraX,
      cameraDragStartY: this.state.cameraY,
      mouseDragStartClientX: e.clientX,
      mouseDragStartClientY: e.clientY
    });
  };

  mouseUp = () => {
    this.setState({ mouseDown: false });
  };

  mouseMove = (e: MouseEvent) => {
    if (this.state.mouseDown) {
      const dx = this.state.mouseDragStartClientX - e.clientX;
      const dy = this.state.mouseDragStartClientY - e.clientY;
      this.setState({
        cameraX: this.state.cameraDragStartX - dx,
        cameraY: this.state.cameraDragStartY - dy
      });
    }
  };

  handleWheel = (e: WheelEvent) => {
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
        <svg
          style={{ width, height }}
          onMouseDown={this.mouseDown}
          onMouseMove={this.mouseMove}
          onMouseUp={this.mouseUp}
          onMouseLeave={this.mouseUp}
          onWheel={this.handleWheel}
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
                  onNodeClick={this.handleNodeClick}
                />
              ))}
            </g>
          </g>
        </svg>
      </div>
    );
  }
}
