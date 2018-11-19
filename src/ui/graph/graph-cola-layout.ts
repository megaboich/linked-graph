import * as cola from "webcola";
import { GraphNode, GraphLink } from "src/graph/objects";

export class GraphColaLayout extends cola.Layout {
  constructor(private render: () => void) {
    super();
  }

  init(nodes: GraphNode[], links: GraphLink[]) {
    this.nodes(nodes)
      .links(links)
      .convergenceThreshold(0.05)
      .size([600, 400])
      .jaccardLinkLengths(50, 0.7)
      //.linkDistance(50)
      .avoidOverlaps(true)
      //.flowLayout("x", 50)
      .on(cola.EventType.start, e => console.log("Cola layout start event", e))
      .on(cola.EventType.tick, e => {
        this.render();
      })
      .on(cola.EventType.end, e => {
        console.log("Cola layout end event", e);
        this.render();
      })
      .start(0, 0, 0);
  }

  /**
   * It is important to override super tick method and return true because we want to draw animation
   */
  protected tick() {
    const converged = super.tick();
    // console.log("tick", converged);

    for (let node of this.nodes()) {
      node.fixed = 0;
    }
    if (!converged) {
      setTimeout(() => this.tick(), 50);
    }

    return true;
  }
}
