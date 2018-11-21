import * as cola from "webcola";
import { GraphNode, GraphLink } from "src/graph/objects";

export class GraphColaLayout extends cola.Layout {
  private timerHandle: any;

  constructor(private render: () => void) {
    super();
  }

  get isRunning() {
    return !!this.timerHandle;
  }

  init(nodes: GraphNode[], links: GraphLink[]) {
    this.clearTimer();
    this.timerHandle = setInterval(this.timerTick, 100);

    this.nodes(nodes)
      .links(links)
      .convergenceThreshold(0.05)
      .size([600, 400])
      .jaccardLinkLengths(50, 0.7)
      //.linkDistance(50)
      .avoidOverlaps(true)
      //.flowLayout("x", 50)
      .on(cola.EventType.start, e => {
        console.log("Cola layout start event", e);
      })
      .on(cola.EventType.tick, e => {
        // console.log("Cola layout tick event", e);
        if (this.isRunning) {
          this.render();
        }
      })
      .on(cola.EventType.end, e => {
        console.log("Cola layout end event", e);
        this.clearTimer();
        this.render();
      })
      .start(0, 0, 0);
  }

  timerTick = () => {
    if (this.isRunning) {
      super.tick();
      for (let node of this.nodes()) {
        node.fixed = 0;
      }
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
