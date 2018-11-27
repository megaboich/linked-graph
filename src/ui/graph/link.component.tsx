import { h, Component } from "preact";
import { GraphLink } from "./graph-objects";

export interface State {}

export interface Props {
  link: GraphLink;
}

export class LinkComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const link = this.props.link;
    const x1 = Math.round(link.source.x);
    const y1 = Math.round(link.source.y);
    const x2 = Math.round(link.target.x);
    const y2 = Math.round(link.target.y);
    return <line className="graph-edge" x1={x1} y1={y1} x2={x2} y2={y2} />;
  }
}
