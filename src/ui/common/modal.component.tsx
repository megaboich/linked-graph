import * as React from "react";
import { Component } from "react";
import * as cn from "classnames";

interface IComponentState {}

interface IComponentProps {
  title: string;
  show: boolean;
  body: JSX.Element;
  footerButtons?: JSX.Element;
  width?: "default" | "medium" | "wide";
  onClose(): void;
  hideFooter?: boolean;
  closeButtonText?: string;
}

export class ModalComponent extends Component<
  IComponentProps,
  IComponentState
> {
  constructor(props: IComponentProps) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    const closeButtonText = this.props.closeButtonText || "Close";
    return (
      <div
        className={cn("modal modal-component", {
          " is-active": this.props.show
        })}
      >
        <div className="modal-background" onClick={this.props.onClose} />
        <div
          className={cn("modal-card", {
            "is-medium": this.props.width === "medium",
            "is-wide": this.props.width === "wide"
          })}
        >
          <header className="modal-card-head">
            <p className="modal-card-title">{this.props.title}</p>
            <button
              className="delete"
              aria-label={closeButtonText}
              title={closeButtonText}
              onClick={this.props.onClose}
            />
          </header>
          <section className={cn("modal-card-body")}>{this.props.body}</section>
          {!this.props.hideFooter && (
            <footer className="modal-card-foot">
              {this.props.footerButtons}

              <button className="button" onClick={this.props.onClose}>
                {closeButtonText}
              </button>
            </footer>
          )}
        </div>
      </div>
    );
  }
}
