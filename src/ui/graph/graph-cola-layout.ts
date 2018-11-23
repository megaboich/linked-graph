import * as cola from "webcola";
import { GraphNode, GraphLink } from "src/ui/graph/objects";

export class GraphColaLayout extends cola.Layout {
  private timerHandle: any;
  public isLayoutCalculated = false;

  constructor(private render: () => void) {
    super();
  }

  get isRunning() {
    return !!this.timerHandle;
  }

  init(options: {
    width: number;
    height: number;
    nodes: GraphNode[];
    links: GraphLink[];
    firstInit: boolean;
  }) {
    this.clearTimer();
    this.timerHandle = setInterval(this.timerTick, 100);
    this.isLayoutCalculated = false;

    /**
     * When we re-initialize layout it is nice idea to fix all nodes so they not jump
     * Later on the first tick iteration those nodes are unfixed
     */
    let shouldRevertOriginalFixedState = false;
    const originalFixedState = options.nodes.map(n => n.fixed);
    if (!options.firstInit) {
      for (const n of options.nodes) {
        n.fixed = 1;
      }
      shouldRevertOriginalFixedState = true;
    }

    this.nodes(options.nodes)
      .links(options.links)
      .convergenceThreshold(0.05)
      .size([options.width, options.height])
      .jaccardLinkLengths(50, 0.7)
      //.linkDistance(50)
      .avoidOverlaps(true)
      //.flowLayout("x", 50)
      .on(cola.EventType.start, e => {
        console.log("Cola layout start event", e);
      })
      .on(cola.EventType.tick, e => {
        this.isLayoutCalculated = true;
        
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
      .start(options.firstInit ? 100 : 0, 0, 0, 0, true);
  }

  triggerLayout() {
    if (!this.isRunning) {
      this.timerHandle = setInterval(this.timerTick, 100);
      this.resume();
    }
  }

  timerTick = () => {
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

  clearTimer() {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = undefined;
    }
  }
}
