import * as React from "react";
import { GraphLink } from "./graph-objects";

export interface Props {
  link: GraphLink;
  drawArrow: boolean;
}

export function LinkComponent(props: Props) {
  const link = props.link;
  const x1 = link.source.x;
  const y1 = link.source.y;
  const x2 = link.target.x;
  const y2 = link.target.y;
  return (
    <line
      className="graph-link"
      x1={Math.round(x1)}
      y1={Math.round(y1)}
      x2={Math.round(x2)}
      y2={Math.round(y2)}
      markerEnd={props.drawArrow ? "url(#marker-arrowend)" : undefined}
    />
  );
}
