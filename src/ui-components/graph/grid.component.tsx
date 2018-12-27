import * as React from "react";

export interface Props {
  step: number;
  count: number;
  centerX: number;
  centerY: number;
}

export function GridComponent(props: Props) {
  const elements = [];
  const gridSize = props.step * Math.floor(props.count / 2);
  let currentPos = -gridSize;
  for (let i = 0; i < props.count + 1; ++i) {
    elements.push(
      <line
        key={"h" + i}
        x1={currentPos}
        y1={-gridSize}
        x2={currentPos}
        y2={gridSize}
      />,
      <line
        key={"v" + i}
        x1={-gridSize}
        y1={currentPos}
        x2={gridSize}
        y2={currentPos}
      />
    );
    currentPos += props.step;
  }
  return (
    <g
      transform={`translate(${props.centerX}, ${props.centerY})`}
      className="grid-lines"
    >
      {elements}
    </g>
  );
}
