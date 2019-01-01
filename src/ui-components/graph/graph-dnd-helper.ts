import { GraphNode } from "./graph-objects";

export interface TouchInfo {
  x: number;
  y: number;
  identifier: number;
}

export interface ViewDimestions {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export function buildTouchInfoFromMouseEvent(event: {
  clientX: number;
  clientY: number;
}): TouchInfo[] {
  return [
    {
      x: event.clientX,
      y: event.clientY,
      identifier: 0
    }
  ];
}

export function buildTouchInfo(touches: React.TouchList): TouchInfo[] {
  const touchInfos = [];
  for (let i = 0; i < touches.length; ++i) {
    const touch = touches.item(i);
    touchInfos.push({
      x: touch.clientX,
      y: touch.clientY,
      identifier: touch.identifier
    });
  }
  return touchInfos;
}

/**
 * Helper class to assist with camera, zooming, drag and drop, touch events
 */
export class GraphDndHelper {
  width: number = 0;
  height: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  cameraX: number = 0;
  cameraY: number = 0;
  cameraZoom: number = 1;

  touches: TouchInfo[] = [];

  dragStartCameraX?: number;
  dragStartCameraY?: number;
  dragStartCameraMouseX?: number;
  dragStartCameraMouseY?: number;
  dragCameraActive?: boolean;
  dragNode?: GraphNode = undefined;
  dragStartNodeX?: number;
  dragStartNodeY?: number;
  dragStartNodeMouseX?: number;
  dragStartNodeMouseY?: number;

  initView(dimensions: ViewDimestions) {
    this.width = dimensions.width;
    this.height = dimensions.height;
    this.offsetX = dimensions.offsetX;
    this.offsetY = dimensions.offsetY;
    this.cameraX = dimensions.width / 2;
    this.cameraY = dimensions.height / 2;
  }

  changeView(dimensions: ViewDimestions) {
    const dx = (this.width - dimensions.width) * this.cameraZoom;
    const dy = (this.height - dimensions.height) * this.cameraZoom;
    this.cameraX = this.cameraX - dx;
    this.cameraY = this.cameraY - dy;
    this.width = dimensions.width;
    this.height = dimensions.height;
    this.offsetX = dimensions.offsetX;
    this.offsetY = dimensions.offsetY;
  }

  private startNodeDrag(node: GraphNode, x: number, y: number) {
    this.dragNode = node;
    this.dragStartNodeX = node.x;
    this.dragStartNodeY = node.y;
    this.dragStartNodeMouseX = x;
    this.dragStartNodeMouseY = y;
  }

  private startCameraDrag(x: number, y: number) {
    this.dragCameraActive = true;
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
  private doDrag(x: number, y: number): boolean {
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
    }
    if (this.dragCameraActive) {
      const dx = (this.dragStartCameraMouseX || 0) - x;
      const dy = (this.dragStartCameraMouseY || 0) - y;
      this.cameraX = (this.dragStartCameraX || 0) - dx;
      this.cameraY = (this.dragStartCameraY || 0) - dy;
    }
    return false;
  }

  private stopDrag() {
    const dragNode = this.dragNode;
    if (dragNode) {
      dragNode.fixed = 0;
    }
    this.dragCameraActive = false;
    this.dragNode = undefined;
  }

  zoom(zoomFactor: number, x: number, y: number) {
    //console.log("zooming with factor" + zoomFactor);
    let newScale = Math.round(this.cameraZoom * (1 - zoomFactor) * 1000) / 1000;
    newScale = Math.max(0.1, newScale);
    newScale = Math.min(10, newScale);

    /**
     * We also need to move camera if we want to keep view exactly centered around zooming point
     * So here we calculate zooming point coordinates before zoom and after zoom and apply that difference to camera
     */
    const zoomPoint1 = {
      x: (x - this.cameraX - this.offsetX) / this.cameraZoom + this.width / 2,
      y: (y - this.cameraY - this.offsetY) / this.cameraZoom + this.height / 2
    };

    this.cameraZoom = newScale;

    const zoomPoint2 = {
      x: (x - this.cameraX - this.offsetX) / this.cameraZoom + this.width / 2,
      y: (y - this.cameraY - this.offsetY) / this.cameraZoom + this.height / 2
    };

    this.cameraX -= (zoomPoint1.x - zoomPoint2.x) * this.cameraZoom;
    this.cameraY -= (zoomPoint1.y - zoomPoint2.y) * this.cameraZoom;
  }

  addTouch(touches: TouchInfo[]) {
    this.touches.push(...touches);
    if (this.touches.length === 1) {
      this.startCameraDrag(this.touches[0].x, this.touches[0].y);
    }
  }

  addNodeTouch(node: GraphNode, event: { clientX: number; clientY: number }) {
    this.touches = buildTouchInfoFromMouseEvent(event);
    this.startNodeDrag(node, event.clientX, event.clientY);
  }

  endTouchById(ids: number[]) {
    this.touches = this.touches.filter(t => !ids.some(x => x === t.identifier));
    if (this.touches.length === 0) {
      this.stopDrag();
    }
    if (this.touches.length === 1) {
      this.startCameraDrag(this.touches[0].x, this.touches[0].y);
    }
  }

  endTouch(touches: TouchInfo[]) {
    this.endTouchById(touches.map(t => t.identifier));
  }

  moveTouch(touchUpdates: TouchInfo[]): boolean {
    let oldDist = -1;
    const touches = this.touches;
    if (touches.length === 2) {
      const dx = touches[0].x - touches[1].x;
      const dy = touches[0].y - touches[1].y;
      oldDist = Math.sqrt(dx * dx + dy * dy);
    }

    for (const update of touchUpdates) {
      for (const t of touches) {
        if (t.identifier === update.identifier) {
          t.x = update.x;
          t.y = update.y;
        }
      }
    }

    if (touches.length === 2) {
      const dx = touches[0].x - touches[1].x;
      const dy = touches[0].y - touches[1].y;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const cx = (touches[0].x + touches[1].x) / 2;
      const cy = (touches[0].y + touches[1].y) / 2;
      const zoomFactor = (oldDist - newDist) / 200;
      this.zoom(zoomFactor, cx, cy);
    }

    if (touches.length === 1) {
      return this.doDrag(touches[0].x, touches[0].y);
    }

    return false;
  }
}
