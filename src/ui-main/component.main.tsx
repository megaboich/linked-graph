import * as React from "react";
import { Component } from "react";

import {
  GraphObject,
  GraphConnection,
  GraphModel,
  GraphOptions
} from "src/data/graph-model";
import { GraphNode } from "src/ui-components/graph/graph-objects";
import { getSamples, GraphSample } from "src/data/data-loader";

import { IconPencil } from "src/ui-components/icons/icon-pencil";
import { IconPlus } from "src/ui-components/icons/icon-plus";
import { GraphComponent } from "src/ui-components/graph/graph.component";
import { TopNavBarComponent } from "./component.top-navbar";
import { ObjectEditorComponentContainer } from "./object-editor/container.object-editor";
import { OptionsComponent } from "./component.options";
import { AboutComponent } from "./component.about";

import "./component.main.less";

export interface Props {
  selectedObject: GraphObject | undefined;
  objects: GraphObject[];
  connections: GraphConnection[];
  options: GraphOptions;

  selectObject(object?: GraphObject): void;
  addObject(currentlySelected?: GraphObject): void;
  showObjectEditor(object: GraphObject, connections: GraphConnection[]): void;
  loadGraph(model: GraphModel): void;
  setOptions(options: GraphOptions): void;
}

export interface State {
  showOptions?: boolean;
  showAbout?: boolean;
}

export class MainComponent extends Component<Props, State> {
  readonly samples = getSamples();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleShowAboutClick = () => {
    this.setState({ showAbout: true });
  };

  handleHideAboutClick = () => {
    this.setState({ showAbout: false });
  };

  handleShowOptionsClick = () => {
    this.setState({ showOptions: true });
  };

  handleHideOptionsClick = () => {
    this.setState({ showOptions: false });
  };

  handleApplyOptionsClick = (options: GraphOptions) => {
    this.setState({ showOptions: false });
    this.props.setOptions(options);
  };

  handleOnSelectNode = (node?: GraphNode) => {
    this.props.selectObject(node);
  };

  handleShowEditorButtonClick = () => {
    if (this.props.selectedObject) {
      this.props.showObjectEditor(
        this.props.selectedObject,
        this.props.connections
      );
    }
  };

  handleNewObjectClick = () => {
    this.props.addObject(this.props.selectedObject);
  };

  handleLoadSampleClick = (sample: GraphSample) => {
    const graph = sample.getGraph();
    this.props.loadGraph(graph);
  };

  render() {
    return (
      <div className="main-component">
        <TopNavBarComponent
          samples={this.samples}
          onAboutClick={this.handleShowAboutClick}
          onOptionsClick={this.handleShowOptionsClick}
          onLoadSampleClick={this.handleLoadSampleClick}
        />

        <ObjectEditorComponentContainer />

        <OptionsComponent
          visible={this.state.showOptions}
          options={this.props.options}
          onClose={this.handleHideOptionsClick}
          onApply={this.handleApplyOptionsClick}
        />

        <AboutComponent
          visible={this.state.showAbout}
          onClose={this.handleHideAboutClick}
        />

        <div className="graph-container">
          <GraphComponent
            useForce={this.props.options.useForceLayout}
            forceLinkLength={this.props.options.forceLayoutLinkLength}
            drawLinkText={this.props.options.drawLinkText}
            drawLinkArrows={this.props.options.drawLinkArrows}
            nodes={this.props.objects}
            links={this.props.connections}
            selectedNode={this.props.selectedObject}
            onSelectNode={this.handleOnSelectNode}
            onNodeDoubleTap={this.handleShowEditorButtonClick}
          />

          <div className="control-block">
            <button
              type="button"
              className="button round-borders is-medium"
              onClick={this.handleNewObjectClick}
            >
              <span className="icon">
                <IconPlus />
              </span>
            </button>
            {this.props.selectedObject && (
              <button
                type="button"
                className="button round-borders is-medium"
                onClick={this.handleShowEditorButtonClick}
              >
                <span className="icon">
                  <IconPencil />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
