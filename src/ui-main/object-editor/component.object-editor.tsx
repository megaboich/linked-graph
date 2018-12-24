import * as React from "react";
import { Component } from "react";
import CreatableSelect from "react-select/lib/Creatable";
import * as cn from "classnames";
import { ensure } from "src/helpers/syntax";

import { GraphObject, GraphConnection } from "src/data/graph-model";
import { ModalComponent } from "src/ui-components/modal.component";
import { IconTrash } from "src/ui-components/icons/icon-trash";
import { IconLoopSquare } from "src/ui-components/icons/icon-loop-square";
import { IconPlus } from "src/ui-components/icons/icon-plus";

import "./component.object-editor.less";

type SelectOption<T> = { value: T; label: string };

interface IComponentState {
  objectName: string;
  isNameInUse?: boolean;
  isNameEmpty?: boolean;
  relationOptions: SelectOption<string>[];
  objectOptions: SelectOption<GraphObject>[];
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
      relationOptions: [],
      objectOptions: []
    };
  }

  componentWillReceiveProps(newProps: IComponentProps) {
    const newObj = newProps.object;
    if (newObj && newObj !== this.props.object) {
      // extract all unique relation types from graph
      const allRelations = Array.from(
        new Set([
          ...newProps.allConnections.map(x => x.relation),
          ...newProps.connections.map(x => x.relation)
        ])
      );

      const objectOptions: SelectOption<GraphObject>[] = newProps.allObjects
        .filter(x => x.id !== newProps.object.id)
        .map(x => ({
          value: x,
          label: x.label || x.id
        }));

      this.setState({
        objectName: newObj ? newObj.label || newObj.id : "",
        isNameEmpty: false,
        isNameInUse: false,
        relationOptions: allRelations
          .filter(x => !!x)
          .map(x => ({
            label: ensure(x),
            value: ensure(x)
          })),
        objectOptions
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
    const isNameInUse = this.state.objectOptions.some(
      x => x.label.trim().toLowerCase() === newName.trim().toLowerCase()
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
          source: c.source === this.props.object ? newObject : c.source,
          target: c.target === this.props.object ? newObject : c.target,
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

    const hasError = this.state.isNameInUse || this.state.isNameEmpty;
    let errorText = "";
    if (this.state.isNameInUse) {
      errorText = "This name is already in use by another object";
    }
    if (this.state.isNameEmpty) {
      errorText = "Object must have name specified";
    }

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
                    {this.renderConnectionRow(connection)}
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

  renderConnectionRow(connection: Partial<GraphConnection>) {
    if (!this.props.object) {
      return;
    }
    return (
      <div className="connection">
        <div className="media">
          <div className="media-content">
            <div className="connection-content">
              {connection.source && connection.source === this.props.object ? (
                <div className="self-object-name">
                  {this.state.objectName || "This object"}
                </div>
              ) : (
                this.renderObjectSelector({
                  object: connection.source,
                  onSelect: newObj => {
                    connection.source = newObj;
                    this.forceUpdate();
                  }
                })
              )}

              {this.renderLinkSelector(connection)}

              {connection.target && connection.target === this.props.object ? (
                <div className="self-object-name">
                  {this.state.objectName || "This object"}
                </div>
              ) : (
                this.renderObjectSelector({
                  object: connection.target,
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
    object: GraphObject | undefined;
    onSelect: (newObj: GraphObject) => void;
  }) {
    const handleCreate = (inputValue: string) => {
      const newObject: GraphObject = {
        label: inputValue,
        id: "",
        x: 0,
        y: 0
      };
      const newOption: SelectOption<GraphObject> = {
        label: inputValue,
        value: newObject
      };
      const newObjOptions = [newOption, ...this.state.objectOptions];
      this.setState({
        objectOptions: newObjOptions
      });
      options.onSelect(newObject);
    };

    return (
      <CreatableSelect
        className="object-selector"
        value={this.state.objectOptions.find(x => x.value === options.object)}
        onChange={newValue => {
          if (newValue && !Array.isArray(newValue)) {
            options.onSelect(newValue.value);
          }
          this.forceUpdate();
        }}
        onCreateOption={handleCreate}
        isValidNewOption={inputValue => {
          if (inputValue) {
            const exist = this.state.objectOptions.some(
              x => x.label === inputValue.trim()
            );
            return !exist;
          }
          return false;
        }}
        options={this.state.objectOptions}
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
