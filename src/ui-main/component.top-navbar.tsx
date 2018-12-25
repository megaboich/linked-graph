import * as React from "react";
import { NavbarComponent } from "src/ui-components/navbar.component";
import { GraphSample } from "src/data/data-loader";
import { IconGraph } from "src/ui-components/icons/icon-graph";

interface Props {
  samples: GraphSample[];
  onAboutClick(): void;
  onOptionsClick(): void;
  onLoadSampleClick(sample: GraphSample): void;
}

export function TopNavBarComponent(props: Props): JSX.Element {
  return (
    <NavbarComponent
      brandContent={
        <span className="navbar-item">
          <span className="icon is-medium">
            <IconGraph />
          </span>
          <span>Linked graph</span>
        </span>
      }
      menuContent={
        <>
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Samples</a>
              <div className="navbar-dropdown">
                {props.samples.map(x => (
                  <a
                    key={x.name}
                    className="navbar-item"
                    onClick={() => props.onLoadSampleClick(x)}
                  >
                    {x.name}
                  </a>
                ))}
              </div>
            </div>
            <a className="navbar-item" href="#" onClick={props.onOptionsClick}>
              Options
            </a>
            <a className="navbar-item" href="#" onClick={props.onAboutClick}>
              About
            </a>
          </div>
        </>
      }
    />
  );
}
