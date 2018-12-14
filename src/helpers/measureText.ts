let canvas: HTMLCanvasElement | undefined;

function getCanvasLazy(): HTMLCanvasElement {
  if (canvas) {
    return canvas;
  }
  canvas = document.createElement("canvas");
  return canvas;
}

export function measureText(
  text: string,
  font: string,
  size: string
): TextMetrics | undefined {
  const ctx = getCanvasLazy().getContext("2d");
  if (ctx) {
    ctx.font = size + " " + font;

    return ctx.measureText(text);
  }
  return undefined;
}
