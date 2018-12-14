import * as React from "react";
import { GraphLink } from "./graph-objects";

export interface Props {
  link: GraphLink;
}

export function LinkComponent(props: Props) {
  const link = props.link;
  const x1 = Math.round(link.source.x);
  const y1 = Math.round(link.source.y);
  const x2 = Math.round(link.target.x);
  const y2 = Math.round(link.target.y);
  return (
    <line
      className="graph-link"
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      markerEnd="url(#marker-arrowend)"
    />
  );
}
