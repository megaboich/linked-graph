import * as React from "react";
import * as cn from "classnames";

interface IComponentState {
  isMenuToggled?: boolean;
}

interface IComponentProps {
  brandContent?: JSX.Element;
  children?: React.ReactNode;
}

export class NavbarComponent extends React.Component<
  IComponentProps,
  IComponentState
> {
  constructor(props: IComponentProps) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    return (
      <nav
        className="navbar navbar-mobile-fix"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          {this.props.brandContent}

          <div
            className={cn("navbar-burger burger", {
              "is-active": this.state.isMenuToggled
            })}
            onClick={() => {
              this.setState({ isMenuToggled: !this.state.isMenuToggled });
            }}
          >
            <span />
            <span />
            <span />
          </div>
        </div>

        <div
          className={cn("navbar-menu", {
            "is-active": this.state.isMenuToggled
          })}
        >
          {this.props.children}
        </div>
      </nav>
    );
  }
}
