import * as React from "react";
import { Component } from "react";
import { GraphLink } from "./graph-objects";
import { measureText } from "src/helpers/measureText";

export interface State {}

export interface Props {
  link: GraphLink;
}

export class LinkTextComponent extends Component<Props, State> {
  textWidth = 0;

  constructor(props: Props) {
    super(props);
    this.state = {};
    this.measureText(props.link.relation);
  }

  measureText(text: string) {
    const metrics = measureText(text, "Arial", "8px");
    if (metrics) {
      this.textWidth = Math.round(metrics.width) + 2;
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.link.relation !== this.props.link.relation) {
      this.measureText(newProps.link.relation);
    }
  }

  render() {
    const props = this.props;
    const link = props.link;
    const x1 = link.source.x;
    const y1 = link.source.y;
    const x2 = link.target.x;
    const y2 = link.target.y;

    /**
     * Calculation of middle coordinates of a link to put text there
     */
    const mx = Math.round((x1 + x2) / 2);
    const my = Math.round((y1 + y2) / 2);

    /**
     * Calculation of link angle, so we rotate text with it
     */
    const dx = x1 - x2;
    const dy = y1 - y2;
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI) + 90;
    if (angle < -90 || angle > 90) {
      angle += 180;
    }

    const lineLength = Math.sqrt(dx * dx + dy * dy);
    if (lineLength < 5) {
      // return empty in case the link is too short
      return <React.Fragment />;
    }

    /**
     * Check if text length is not too long and truncate it
     */
    let textLength = this.textWidth;
    let textToRender = props.link.relation;
    if (textLength > 0 && textToRender) {
      const maxTextLength = lineLength - 25;
      if (textLength > maxTextLength) {
        const newW =
          Math.round((maxTextLength * textToRender.length) / textLength) - 2;
        textToRender = textToRender.substring(0, newW).trim() + "...";
        textLength = maxTextLength;
      }
    }

    /**
     * Calculating coordinates for text background line (because in SVG we can't set non-transparent background to text)
     */
    const bgLineLenX = (dx * textLength) / lineLength;
    const bgLineLenY = (dy * textLength) / lineLength;
    const bgLineX1 = Math.round(x1 - dx / 2 - bgLineLenX / 2);
    const bgLineX2 = Math.round(x1 - dx / 2 + bgLineLenX / 2);
    const bgLineY1 = Math.round(y1 - dy / 2 - bgLineLenY / 2);
    const bgLineY2 = Math.round(y1 - dy / 2 + bgLineLenY / 2);

    return (
      <>
        <line
          className="graph-link-text-bg"
          x1={bgLineX1}
          y1={bgLineY1}
          x2={bgLineX2}
          y2={bgLineY2}
        />
        <text
          className="graph-link-text"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${angle},${mx},${my})`}
          x={mx}
          y={my}
        >
          {textToRender}
        </text>
      </>
    );
  }
}
