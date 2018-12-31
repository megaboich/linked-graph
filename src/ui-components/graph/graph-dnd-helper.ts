import { GraphNode } from "./graph-objects";

/**
 * Helper class to assist with drag and drop
 */
export class GraphDndHelper {
  cameraX: number = 0;
  cameraY: number = 0;
  cameraZoom: number = 1;
  dragStartCameraX?: number;
  dragStartCameraY?: number;
  dragStartCameraMouseX?: number;
  dragStartCameraMouseY?: number;
  mouseDown?: boolean;
  dragNode?: GraphNode = undefined;
  dragStartNodeX?: number;
  dragStartNodeY?: number;
  dragStartNodeMouseX?: number;
  dragStartNodeMouseY?: number;
  width: number = 0;
  height: number = 0;
  zoomStartDistance?: number;

  initViewSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cameraX = width / 2;
    this.cameraY = height / 2;
  }

  handleViewResize(width: number, height: number) {
    const dx = (this.width - width) * this.cameraZoom;
    const dy = (this.height - height) * this.cameraZoom;
    this.cameraX = this.cameraX - dx;
    this.cameraY = this.cameraY - dy;
    this.width = width;
    this.height = height;
  }

  startNodeDrag(node: GraphNode, x: number, y: number) {
    this.dragNode = node;
    this.dragStartNodeX = node.x;
    this.dragStartNodeY = node.y;
    this.dragStartNodeMouseX = x;
    this.dragStartNodeMouseY = y;
  }

  startCameraDrag(x: number, y: number) {
    this.mouseDown = true;
    this.dragNode = undefined;
    this.dragStartCameraX = this.cameraX;
    this.dragStartCameraY = this.cameraY;
    this.dragStartCameraMouseX = x;
    this.dragStartCameraMouseY = y;
  }

  /**
   * Process drag operation
   * @returns true, if node is moved
   */
  doDrag(x: number, y: number): boolean {
    const dragNode = this.dragNode;
    if (dragNode) {
      const dx = (this.dragStartNodeMouseX || 0) - x;
      const dy = (this.dragStartNodeMouseY || 0) - y;
      dragNode.x = (this.dragStartNodeX || 0) - dx / this.cameraZoom;
      dragNode.y = (this.dragStartNodeY || 0) - dy / this.cameraZoom;
      dragNode.px = dragNode.x;
      dragNode.py = dragNode.y;
      dragNode.fixed = 1;
      return true;
    } else if (this.mouseDown) {
      const dx = (this.dragStartCameraMouseX || 0) - x;
      const dy = (this.dragStartCameraMouseY || 0) - y;
      this.cameraX = (this.dragStartCameraX || 0) - dx;
      this.cameraY = (this.dragStartCameraY || 0) - dy;
    }
    return false;
  }

  stopInteractions() {
    const dragNode = this.dragNode;
    if (dragNode) {
      dragNode.fixed = 0;
    }
    this.mouseDown = false;
    this.dragNode = undefined;
    this.zoomStartDistance = undefined;
  }

  zoom(zoomFactor: number, x: number, y: number) {
    let newScale = Math.round(this.cameraZoom * (1 - zoomFactor) * 1000) / 1000;
    newScale = Math.max(0.1, newScale);
    newScale = Math.min(10, newScale);

    const m1 = {
      x: (x - this.cameraX) / this.cameraZoom + this.width / 2,
      y: (y - this.cameraY) / this.cameraZoom + this.height / 2
    };

    this.cameraZoom = newScale;

    const m2 = {
      x: (x - this.cameraX) / this.cameraZoom + this.width / 2,
      y: (y - this.cameraY) / this.cameraZoom + this.height / 2
    };

    this.cameraX -= (m1.x - m2.x) * this.cameraZoom;
    this.cameraY -= (m1.y - m2.y) * this.cameraZoom;
  }

  startZoomingWith2Points(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    this.zoomStartDistance = Math.sqrt(dx * dx + dy * dy);
  }

  zoomWith2Points(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    if (this.zoomStartDistance === undefined) {
      return;
    }
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const zoomFactor = (distance - this.zoomStartDistance) / 10;
    const cx = (p1.x + p2.x) / 2;
    const cy = (p1.y + p2.y) / 2;
    this.zoom(zoomFactor, cx, cy);
  }
}
