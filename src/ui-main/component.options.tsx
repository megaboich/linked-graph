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

export interface State extends GraphOptions {}

export class OptionsComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...props.options
    };
  }

  componentWillReceiveProps(newProps: Props) {
    if (JSON.stringify(this.state) != JSON.stringify(newProps.options)) {
      this.setState({ ...newProps.options });
    }
  }

  handleCloseModal = () => {
    this.props.onClose();
  };

  handleApplyClick = () => {
    this.props.onApply({ ...this.state });
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
                    checked={this.state.drawLinkArrows}
                    onChange={e =>
                      this.setState({ drawLinkArrows: e.target.checked })
                    }
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
                    checked={this.state.drawLinkText}
                    onChange={e =>
                      this.setState({ drawLinkText: e.target.checked })
                    }
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
                    checked={this.state.useForceLayout}
                    onChange={e =>
                      this.setState({ useForceLayout: e.target.checked })
                    }
                  />{" "}
                  Enable force layout
                </label>
              </div>
            </div>
            <div className="field-link-length">
              <label>Link length:</label>
              <input
                disabled={!this.state.useForceLayout}
                className="input"
                type="number"
                value={this.state.forceLayoutLinkLength}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v)) {
                    this.setState({
                      forceLayoutLinkLength: v
                    });
                  }
                }}
              />
            </div>
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={this.state.drawRulerGrid}
                    onChange={e =>
                      this.setState({ drawRulerGrid: e.target.checked })
                    }
                  />{" "}
                  Draw ruler grid
                </label>
              </div>
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
