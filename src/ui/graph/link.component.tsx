import * as React from "react";
import { GraphLink } from "src/graph/objects";

export interface State {}

export interface Props {
  link: GraphLink;
}

export class LinkComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const link = this.props.link;
    return (
      <line
        strokeWidth="1"
        x1={link.source.x}
        y1={link.source.y}
        x2={link.target.x}
        y2={link.target.y}
      />
    );
  }
}
