import * as React from "react";
import { Component } from "react";
import Select from "react-select";
import * as cn from "classnames";
import { GraphObject, GraphConnection } from "src/services/graph-model";
import { ModalComponent } from "./common/modal.component";

import "./object-details-modal.component.less";

type SelectOption = { value: string; label: string };

interface IComponentState {
  objectName: string;
  isNameInUse?: boolean;
  isNameEmpty?: boolean;
  connections: Partial<GraphConnection>[];
}

interface IComponentProps {
  object: GraphObject;
  allObjects: GraphObject[];
  allConnections: GraphConnection[];
  onClose(): void;
  onSave(object: GraphObject, connections: GraphConnection[]): void;
}

export class ObjectDetailsModalComponent extends Component<
  IComponentProps,
  IComponentState
> {
  constructor(props: IComponentProps) {
    super(props);

    // Filter only related connections to object
    const connections = props.allConnections
      .filter(
        x => x.source.id === props.object.id || x.target.id === props.object.id
      )
      .map(x => ({ ...x }));

    this.state = {
      objectName: props.object.label || props.object.id,
      connections: connections
    };
  }

  handleCloseModal = () => {
    this.props.onClose();
  };

  handleObjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const objId = this.props.object.id;
    const isNameInUse = this.props.allObjects.some(
      x =>
        (x.label || x.id).trim().toLowerCase() ===
          newName.trim().toLowerCase() && x.id !== objId
    );
    this.setState({
      objectName: newName,
      isNameEmpty: !newName.trim(),
      isNameInUse: isNameInUse
    });
  };

  handleSaveClick = () => {
    const newObject = { ...this.props.object };
    newObject.label = this.state.objectName;

    const connections: GraphConnection[] = [];
    for (const c of this.state.connections) {
      if (c.source && c.target) {
        connections.push({
          source: c.source,
          target: c.target
        });
      }
    }

    this.props.onSave(newObject, connections);
    this.props.onClose();
  };

  handleAddConnectionClick = () => {
    const newConnection: Partial<GraphConnection> = {
      source: this.props.object
    };
    this.setState({
      connections: [...this.state.connections, newConnection]
    });
  };

  handleReverseConnectionClick = (connection: Partial<GraphConnection>) => {
    const newConnection: Partial<GraphConnection> = {
      source: connection.target,
      target: connection.source
    };
    const index = this.state.connections.indexOf(connection);
    if (index >= 0) {
      const connections = this.state.connections.slice();
      connections.splice(index, 1, newConnection);
      this.setState({ connections });
    }
  };

  handleRemoveConnectionClick = (connection: Partial<GraphConnection>) => {
    const connections = this.state.connections.filter(x => x !== connection);
    this.setState({ connections });
  };

  render(): JSX.Element {
    const hasError = this.state.isNameInUse || this.state.isNameEmpty;
    let errorText = "";
    if (this.state.isNameInUse) {
      errorText = "This name is already in use by another object";
    }
    if (this.state.isNameEmpty) {
      errorText = "Object must have name specified";
    }

    const objectsOptions: SelectOption[] = this.props.allObjects
      .filter(x => x.id !== this.props.object.id)
      .map(x => ({
        value: x.id,
        label: x.label || x.id
      }));

    return (
      <ModalComponent
        title="Object details"
        show
        onClose={this.handleCloseModal}
        body={
          <div className="object-details-modal-body">
            <div className="field">
              <label className="label">Object name</label>
              <div className="control has-icons-right">
                <input
                  className={cn("input", { "is-danger": hasError })}
                  type="text"
                  placeholder="Name of object"
                  value={this.state.objectName}
                  onChange={this.handleObjectNameChange}
                />
                {hasError && (
                  <span className="icon is-small is-right">
                    <span className="oi" data-glyph="warning" />
                  </span>
                )}
              </div>
              {hasError && <p className="help is-danger">{errorText}</p>}
            </div>
            <div className="field">
              <label className="label">Connections</label>

              <div className="connections-container">
                {this.state.connections.map((connection, index) => (
                  <React.Fragment key={index}>
                    {this.renderConnectionRow(connection, objectsOptions)}
                  </React.Fragment>
                ))}
              </div>
              <div className="has-text-right">
                <button
                  className="button"
                  onClick={this.handleAddConnectionClick}
                >
                  <span className="icon">
                    <span className="oi" data-glyph="plus" />
                  </span>
                  <span>Add new connection</span>
                </button>
              </div>
            </div>
          </div>
        }
        footerButtons={
          <button
            className={cn("button", { "is-success": !hasError })}
            onClick={!hasError ? this.handleSaveClick : undefined}
            disabled={hasError}
          >
            Save changes
          </button>
        }
      />
    );
  }

  renderConnectionRow(
    connection: Partial<GraphConnection>,
    objectsOptions: SelectOption[]
  ) {
    return (
      <div className="connection">
        <div className="media">
          <div className="media-content">
            <div className="connection-content">
              {connection.source &&
                connection.source.id === this.props.object.id && (
                  <>
                    <div className="self-object-name">
                      {this.state.objectName}
                    </div>

                    {this.renderLinkSelector()}

                    {this.renderObjectSelector({
                      allObjects: objectsOptions,
                      objId: connection.target
                        ? connection.target.id
                        : undefined,
                      onSelect: newObj => {
                        connection.target = newObj;
                        this.forceUpdate();
                      }
                    })}
                  </>
                )}
              {connection.target &&
                connection.target.id === this.props.object.id && (
                  <>
                    {this.renderObjectSelector({
                      allObjects: objectsOptions,
                      objId: connection.source
                        ? connection.source.id
                        : undefined,
                      onSelect: newObj => {
                        connection.source = newObj;
                        this.forceUpdate();
                      }
                    })}

                    {this.renderLinkSelector()}

                    <div className="self-object-name">
                      {this.state.objectName}
                    </div>
                  </>
                )}
            </div>
          </div>
          <div className="media-right">
            <nav className="level is-mobile">
              <div className="level-left">
                <a
                  className="level-item"
                  onClick={() => {
                    this.handleReverseConnectionClick(connection);
                  }}
                >
                  <span className="icon">
                    <span className="oi" data-glyph="loop-square" />
                  </span>
                </a>
                <a
                  className="level-item"
                  onClick={() => {
                    this.handleRemoveConnectionClick(connection);
                  }}
                >
                  <span className="icon">
                    <span className="oi" data-glyph="trash" />
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    );
  }

  renderObjectSelector(options: {
    objId: string | undefined;
    allObjects: SelectOption[];
    onSelect: (newObj: GraphObject) => void;
  }) {
    return (
      <Select
        className="object-selector"
        value={options.allObjects.find(x => x.value === options.objId)}
        onChange={newValue => {
          if (newValue && !Array.isArray(newValue)) {
            const newTarget = this.props.allObjects.find(
              x => x.id === newValue.value
            );
            if (newTarget) {
              options.onSelect(newTarget);
            }
          }
          this.forceUpdate();
        }}
        options={options.allObjects}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuPlacement="bottom"
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 })
        }}
      />
    );
  }

  renderLinkSelector() {
    const linkOptions: SelectOption[] = [
      { value: "related_to", label: "related to" }
    ];
    return (
      <Select
        className="link-selector"
        value={linkOptions[0]}
        onChange={newValue => {}}
        options={linkOptions}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuPlacement="bottom"
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 })
        }}
      />
    );
  }
}
