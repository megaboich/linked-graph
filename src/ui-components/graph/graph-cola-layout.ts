import * as cola from "webcola";
import { GraphNode, GraphLink } from "./graph-objects";

export class GraphColaLayout extends cola.Layout {
  private _enabled = true;
  private timerHandle: any;
  private _isLayoutCalculated = false;

  constructor(private render: () => void) {
    super();
  }

  get isRunning() {
    return !!this.timerHandle;
  }

  get isLayoutCalculated() {
    if (!this._enabled) {
      return true;
    }
    return this._isLayoutCalculated;
  }

  init(options: {
    enable: boolean;
    width: number;
    height: number;
    nodes: GraphNode[];
    links: GraphLink[];
    forceLinkLength: number;
  }) {
    this._enabled = options.enable;
    if (!this._enabled) {
      this.clearTimer(); // In case we have simulation running
      return;
    }
    this.startTimer();
    this._isLayoutCalculated = false;

    /**
     * When we re-initialize layout it is nice idea to fix all nodes so they not jump
     * Later on the first tick iteration those nodes are unfixed
     */
    let shouldRevertOriginalFixedState = false;
    const originalFixedState = options.nodes.map(n => n.fixed);
    for (const n of options.nodes) {
      n.fixed = 1;
    }
    shouldRevertOriginalFixedState = true;

    this.nodes(options.nodes)
      .links(options.links)
      .convergenceThreshold(0.05)
      .size([options.width, options.height])
      .jaccardLinkLengths(options.forceLinkLength, 0.7)
      //.linkDistance(50)
      .avoidOverlaps(true)
      //.flowLayout("x", 50)
      .on(cola.EventType.start, e => {
        console.log("Cola layout start event", e);
      })
      .on(cola.EventType.tick, e => {
        this._isLayoutCalculated = true;

        // Unfix previously fixed nodes
        if (shouldRevertOriginalFixedState) {
          for (let ni = 0; ni < options.nodes.length; ++ni) {
            options.nodes[ni].fixed = originalFixedState[ni];
          }
          shouldRevertOriginalFixedState = false;
        }

        if (this.isRunning) {
          this.render();
        }
      })
      .on(cola.EventType.end, e => {
        console.log("Cola layout end event", e);
        this.clearTimer();
        this.render();
      })
      .start(0, 0, 0, 0, true);
  }

  triggerLayout() {
    if (!this._enabled) {
      return;
    }
    if (!this.isRunning) {
      this.startTimer();
      this.resume();
    }
  }

  timerTick = () => {
    if (!this._enabled) {
      return;
    }
    if (this.isRunning) {
      super.tick();
    }
  };

  /**
   * It is important to override super tick method and return true.
   * This will stop WebCola to call it in a loop until layout finish
   * We want to call original tick in the timer manually in order to animate layout
   */
  protected tick() {
    return true;
  }

  startTimer() {
    if (!this._enabled) {
      return;
    }
    if (!this.timerHandle) {
      this.timerHandle = setInterval(this.timerTick, 50);
    }
  }

  clearTimer() {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = undefined;
    }
  }
}
