import * as React from "react";
import { Component } from "react";
import { GraphOptions } from "src/data/graph-model";
import { ModalComponent } from "src/ui-components/modal.component";

import "./component.options.less";

export interface Props {
  visible?: boolean;
  options: GraphOptions;
  onClose(): void;
  onApply(changedOptions: GraphOptions): void;
}

export interface State {
  changedOptions: GraphOptions;
}

export class OptionsComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      changedOptions: { ...props.options }
    };
  }

  componentWillReceiveProps(newProps: Props) {
    if (
      JSON.stringify(this.state.changedOptions) !=
      JSON.stringify(newProps.options)
    ) {
      this.setState({ changedOptions: { ...newProps.options } });
    }
  }

  handleCloseModal = () => {
    this.props.onClose();
  };

  handleApplyClick = () => {
    this.props.onApply({ ...this.state.changedOptions });
  };

  render() {
    return (
      <ModalComponent
        title={"Options"}
        show={this.props.visible}
        onClose={this.handleCloseModal}
        body={
          <div className="options-modal-body">
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={this.state.changedOptions.drawLinkArrows}
                    onChange={e => {
                      this.state.changedOptions.drawLinkArrows =
                        e.target.checked;
                      this.forceUpdate();
                    }}
                  />{" "}
                  Draw link arrows
                </label>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={this.state.changedOptions.drawLinkText}
                    onChange={e => {
                      this.state.changedOptions.drawLinkText = e.target.checked;
                      this.forceUpdate();
                    }}
                  />{" "}
                  Draw link text
                </label>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={this.state.changedOptions.useForceLayout}
                    onChange={e => {
                      this.state.changedOptions.useForceLayout =
                        e.target.checked;
                      this.forceUpdate();
                    }}
                  />{" "}
                  Enable force layout
                </label>
              </div>
            </div>
            <div className="field-link-length">
              <label>Link length:</label>
              <input
                disabled={!this.state.changedOptions.useForceLayout}
                className="input"
                type="number"
                value={this.state.changedOptions.forceLayoutLinkLength}
                onChange={e => {
                  this.state.changedOptions.forceLayoutLinkLength = parseInt(
                    e.target.value,
                    10
                  );
                  this.forceUpdate();
                }}
              />
            </div>
          </div>
        }
        footerButtons={
          <button className="button is-success" onClick={this.handleApplyClick}>
            Apply
          </button>
        }
      />
    );
  }
}
