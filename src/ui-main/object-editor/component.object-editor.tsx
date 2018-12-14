import * as React from "react";
import { Component } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/lib/Creatable";
import * as cn from "classnames";
import { ensure } from "src/helpers/syntax";

import { GraphObject, GraphConnection } from "src/data/graph-model";
import { ModalComponent } from "src/ui-components/modal.component";
import { IconTrash } from "src/ui-components/icons/icon-trash";
import { IconLoopSquare } from "src/ui-components/icons/icon-loop-square";
import { IconPlus } from "src/ui-components/icons/icon-plus";

import "./component.object-editor.less";

type SelectOption = { value: string; label: string };

interface IComponentState {
  objectName: string;
  isNameInUse?: boolean;
  isNameEmpty?: boolean;
  relationOptions: SelectOption[];
}

interface IComponentProps {
  isVisible: boolean;
  object: GraphObject;
  connections: Partial<GraphConnection>[];
  allObjects: GraphObject[];
  allConnections: GraphConnection[];
  removeObject(): void;
  hideObjectEditor(): void;
  editObject(newObject: GraphObject, newConnections: GraphConnection[]): void;
  reverseConnection(connection: Partial<GraphConnection>): void;
  addConnection(): void;
  removeConnection(connection: Partial<GraphConnection>): void;
}

export class ObjectEditorComponent extends Component<
  IComponentProps,
  IComponentState
> {
  constructor(props: IComponentProps) {
    super(props);
    this.state = {
      objectName: "",
      relationOptions: []
    };
  }

  componentWillReceiveProps(newProps: IComponentProps) {
    const newObj = newProps.object;
    if (newObj !== this.props.object) {
      // extract all unique relation types from graph
      const allRelations = Array.from(
        new Set([
          ...newProps.allConnections.map(x => x.relation),
          ...newProps.connections.map(x => x.relation)
        ])
      );

      this.setState({
        objectName: newObj ? newObj.label || newObj.id : "",
        isNameEmpty: false,
        isNameInUse: false,
        relationOptions: allRelations
          .filter(x => !!x)
          .map(x => ({
            label: ensure(x),
            value: ensure(x)
          }))
      });
    }
  }

  handleCloseModal = () => {
    this.props.hideObjectEditor();
  };

  handleObjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    this.setState({
      objectName: newName
    });
  };

  handleObjectNameBlur = () => {
    const newName = this.state.objectName;
    const objId = this.props.object.id;
    const isNameInUse = this.props.allObjects.some(
      x =>
        (x.label || x.id).trim().toLowerCase() ===
          newName.trim().toLowerCase() && x.id !== objId
    );
    this.setState({
      isNameEmpty: !newName.trim(),
      isNameInUse: isNameInUse
    });
  };

  handleSaveClick = () => {
    const newObject = { ...this.props.object };
    newObject.label = this.state.objectName;

    const connections: GraphConnection[] = [];
    for (const c of this.props.connections) {
      if (c.source && c.target) {
        connections.push({
          source: c.source,
          target: c.target,
          relation: c.relation || "related to"
        });
      }
    }

    this.props.editObject(newObject, connections);
    this.props.hideObjectEditor();
  };

  handleAddConnectionClick = () => {
    this.props.addConnection();
  };

  handleReverseConnectionClick = (connection: Partial<GraphConnection>) => {
    this.props.reverseConnection(connection);
  };

  handleRemoveConnectionClick = (connection: Partial<GraphConnection>) => {
    this.props.removeConnection(connection);
  };

  handleRemoveObjectClick = () => {
    this.props.removeObject();
    this.props.hideObjectEditor();
  };

  render(): JSX.Element {
    if (!this.props.isVisible) {
      return <div />;
    }
    const currentObjId = this.props.object.id;

    const hasError = this.state.isNameInUse || this.state.isNameEmpty;
    let errorText = "";
    if (this.state.isNameInUse) {
      errorText = "This name is already in use by another object";
    }
    if (this.state.isNameEmpty) {
      errorText = "Object must have name specified";
    }

    const objectsOptions: SelectOption[] = this.props.allObjects
      .filter(x => x.id !== currentObjId)
      .map(x => ({
        value: x.id,
        label: x.label || x.id
      }));

    const isAddNewObject = !this.props.object.id;
    const title = isAddNewObject ? "Add new object" : "Edit object";

    return (
      <ModalComponent
        title={title}
        show
        onClose={this.handleCloseModal}
        body={
          <div className="object-editor-modal-body">
            <div className="field">
              <label className="label">Object name</label>
              <div className="control has-icons-right">
                <input
                  className={cn("input", { "is-danger": hasError })}
                  type="text"
                  placeholder="Name of object"
                  autoFocus
                  value={this.state.objectName}
                  onChange={this.handleObjectNameChange}
                  onBlur={this.handleObjectNameBlur}
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
              <div className="connections-container">
                {this.props.connections.map((connection, index) => (
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
                    <IconPlus />
                  </span>
                  <span>Add new connection</span>
                </button>
              </div>
            </div>
          </div>
        }
        headerButtons={
          !isAddNewObject && (
            <button
              title="Delete this object"
              className="button round-borders is-danger is-outlined margin-right-small"
              onClick={this.handleRemoveObjectClick}
            >
              <span className="icon">
                <IconTrash />
              </span>
            </button>
          )
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
    if (!this.props.object) {
      return;
    }
    return (
      <div className="connection">
        <div className="media">
          <div className="media-content">
            <div className="connection-content">
              {connection.source &&
              connection.source.id === this.props.object.id ? (
                <div className="self-object-name">
                  {this.state.objectName || "This object"}
                </div>
              ) : (
                this.renderObjectSelector({
                  allObjects: objectsOptions,
                  objId: connection.source ? connection.source.id : undefined,
                  onSelect: newObj => {
                    connection.source = newObj;
                    this.forceUpdate();
                  }
                })
              )}

              {this.renderLinkSelector(connection)}

              {connection.target &&
              connection.target.id === this.props.object.id ? (
                <div className="self-object-name">
                  {this.state.objectName || "This object"}
                </div>
              ) : (
                this.renderObjectSelector({
                  allObjects: objectsOptions,
                  objId: connection.target ? connection.target.id : undefined,
                  onSelect: newObj => {
                    connection.target = newObj;
                    this.forceUpdate();
                  }
                })
              )}
            </div>
          </div>
          <div className="media-right">
            <nav className="level is-mobile">
              <div className="level-left">
                <a
                  className="level-item"
                  href="javascript:void(0)"
                  onClick={() => {
                    this.handleReverseConnectionClick(connection);
                  }}
                >
                  <span className="icon">
                    <IconLoopSquare />
                  </span>
                </a>
                <a
                  className="level-item"
                  href="javascript:void(0)"
                  onClick={() => {
                    this.handleRemoveConnectionClick(connection);
                  }}
                >
                  <span className="icon">
                    <IconTrash />
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

  renderLinkSelector(connection: Partial<GraphConnection>) {
    const handleCreate = (inputValue: string) => {
      connection.relation = inputValue;
      this.setState({
        relationOptions: [
          { label: inputValue, value: inputValue },
          ...this.state.relationOptions
        ]
      });
    };

    const selectedValue = this.state.relationOptions.find(
      x => x.value === connection.relation
    );

    return (
      <CreatableSelect
        className="link-selector"
        value={selectedValue}
        onChange={newValue => {
          if (newValue && !Array.isArray(newValue)) {
            connection.relation = newValue.value;
          }
          this.forceUpdate();
        }}
        onCreateOption={handleCreate}
        options={this.state.relationOptions}
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
