import * as React from "react";
import { Component } from "react";

import { GraphObject, GraphConnection } from "src/services/graph-model";
import { NavbarComponent } from "./common/navbar.component";
import { GraphNode } from "./graph/graph-objects";
import { GraphComponent } from "./graph/graph.component";

import "./main.component.less";
import { AppState } from "src/services/store";
import { ModalComponent } from "./common/modal.component";
import { ObjectDetailsModalComponent } from "./object-details-modal.component";

export interface Props extends AppState {
  selectObject(object?: GraphObject): void;
  addObject(): void;
  removeObject(): void;
  toggleObjectDetails(show: boolean): void;
  editObject(newObject: GraphObject, newConnections: GraphConnection[]): void;
}

export interface State {}

export class MainComponent extends Component<Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleNewNodeClick = () => {
    this.props.addObject();
  };

  handleDeleteNodeClick = () => {
    this.props.removeObject();
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

  render() {
    return (
      <div className="main-component">
        <NavbarComponent
          brandContent={<span className="navbar-item">Linked graph</span>}
          menuContent={
            <div className="navbar-end">
              <a
                className="navbar-item"
                href="#"
                onClick={this.handleNewNodeClick}
              >
                New node
              </a>
              <a
                className="navbar-item"
                href="#"
                onClick={this.handleDeleteNodeClick}
              >
                Delete node
              </a>
            </div>
          }
        />
        {this.props.showObjectDetails && this.props.selectedObject && (
          <ObjectDetailsModalComponent
            object={this.props.selectedObject}
            allObjects={this.props.objects}
            allConnections={this.props.connections}
            onClose={this.handleCloseDetailsModal}
            onSave={this.handleGraphModification}
          />
        )}

        <div className="graph-container">
          <GraphComponent
            nodes={this.props.objects}
            links={this.props.connections}
            selectedNode={this.props.selectedObject}
            onSelectNode={this.handleOnSelectNode}
          />

          <div className="control-block">
            <button
              type="button"
              className="button is-rounded is-medium"
              onClick={this.handleNewNodeClick}
            >
              <span className="icon">
                <span className="oi" data-glyph="plus" />
              </span>
            </button>
            {this.props.selectedObject && (
              <button
                type="button"
                className="button is-rounded is-medium"
                onClick={this.handleShowDetailsButtonClick}
              >
                <span className="icon">
                  <span className="oi" data-glyph="pencil" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
