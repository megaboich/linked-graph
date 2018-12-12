import * as React from "react";
import { Component } from "react";

import { GraphObject, GraphConnection, GraphModel } from "src/data/graph-model";
import { GraphNode } from "src/ui-components/graph/graph-objects";
import { getSamples, GraphSample } from "src/data/data-loader";

import { IconPencil } from "src/ui-components/icons/icon-pencil";
import { IconPlus } from "src/ui-components/icons/icon-plus";
import { GraphComponent } from "src/ui-components/graph/graph.component";
import { TopNavBarComponent } from "./component.top-navbar";

import "./component.main.less";
import { ObjectEditorComponentContainer } from "./object-editor/container.object-editor";

export interface Props {
  selectedObject: GraphObject | undefined;
  objects: GraphObject[];
  connections: GraphConnection[];

  selectObject(object?: GraphObject): void;
  addObject(currentlySelected?: GraphObject): void;
  showObjectEditor(object: GraphObject, connections: GraphConnection[]): void;
  loadGraph(model: GraphModel): void;
}

export interface State {}

export class MainComponent extends Component<Props, State> {
  readonly samples = getSamples();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleAboutClick = () => {
    //TODO
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
          onAboutClick={this.handleAboutClick}
          onLoadSampleClick={this.handleLoadSampleClick}
        />

        <ObjectEditorComponentContainer />

        <div className="graph-container">
          <GraphComponent
            nodes={this.props.objects}
            links={this.props.connections}
            selectedNode={this.props.selectedObject}
            onSelectNode={this.handleOnSelectNode}
            onDoubleClickNode={this.handleShowEditorButtonClick}
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
