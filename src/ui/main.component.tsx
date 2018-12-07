import * as React from "react";
import { Component } from "react";

import {
  GraphObject,
  GraphConnection,
  GraphModel
} from "src/services/graph-model";
import { GraphNode } from "./graph/graph-objects";
import { getSamples, GraphSample } from "src/services/data/data-loader";

import { NavbarComponent } from "./common/navbar.component";
import { IconPencil } from "./common/icons/icon-pencil";
import { IconPlus } from "./common/icons/icon-plus";
import { GraphComponent } from "./graph/graph.component";
import { ObjectDetailsModalComponent } from "./object-details-modal.component";

import "./main.component.less";

export interface Props {
  selectedObject: GraphObject | undefined;
  showObjectDetails: boolean;
  objects: GraphObject[];
  connections: GraphConnection[];

  selectObject(object?: GraphObject): void;
  addObject(): void;
  removeObject(): void;
  toggleObjectDetails(show: boolean): void;
  editObject(newObject: GraphObject, newConnections: GraphConnection[]): void;
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

  handleCloseDetailsModal = () => {
    this.props.toggleObjectDetails(false);
  };

  handleShowDetailsButtonClick = () => {
    this.props.toggleObjectDetails(true);
  };

  handleGraphModification = (
    newObject: GraphObject,
    newConnections: GraphConnection[]
  ) => {
    this.props.editObject(newObject, newConnections);
  };

  handleNewObjectClick = () => {
    this.props.addObject();
  };

  handleRemoveObjectClick = () => {
    if (this.props.selectedObject) {
      this.props.toggleObjectDetails(false);
      this.props.removeObject();
    }
  };

  handleLoadSampleClick = (sample: GraphSample) => {
    const graph = sample.getGraph();
    this.props.loadGraph(graph);
  };

  render() {
    return (
      <div className="main-component">
        <NavbarComponent
          brandContent={<span className="navbar-item">Linked graph</span>}
          menuContent={
            <>
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Samples</a>
                <div className="navbar-dropdown">
                  {this.samples.map(x => (
                    <a
                      key={x.name}
                      className="navbar-item"
                      onClick={() => this.handleLoadSampleClick(x)}
                    >
                      {x.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="navbar-end">
                <a
                  className="navbar-item"
                  href="#"
                  onClick={this.handleAboutClick}
                >
                  About
                </a>
              </div>
            </>
          }
        />
        {this.props.showObjectDetails && this.props.selectedObject && (
          <ObjectDetailsModalComponent
            object={this.props.selectedObject}
            allObjects={this.props.objects}
            allConnections={this.props.connections}
            onClose={this.handleCloseDetailsModal}
            onSave={this.handleGraphModification}
            onRemoveObject={this.handleRemoveObjectClick}
          />
        )}

        <div className="graph-container">
          <GraphComponent
            nodes={this.props.objects}
            links={this.props.connections}
            selectedNode={this.props.selectedObject}
            onSelectNode={this.handleOnSelectNode}
            onDoubleClickNode={this.handleShowDetailsButtonClick}
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
                onClick={this.handleShowDetailsButtonClick}
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
