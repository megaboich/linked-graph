import * as React from "react";
import { NavbarComponent } from "src/ui-components/navbar.component";
import { GraphSample } from "src/data/data-loader";
import { IconGraph } from "src/ui-components/icons/icon-graph";
import { IconInfo } from "src/ui-components/icons/icon-info";
import { IconCog } from "src/ui-components/icons/icon-cog";
import { IconUndo } from "src/ui-components/icons/icon-undo";
import { IconPuzzle } from "src/ui-components/icons/icon-puzzle";

interface Props {
  samples: GraphSample[];
  isUndoEnabled: boolean;
  onAboutClick(): void;
  onOptionsClick(): void;
  onLoadSampleClick(sample: GraphSample): void;
  onUndoClick(): void;
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
            <a className="navbar-item" href="#" onClick={props.onAboutClick}>
              <span className="icon is-medium">
                <IconInfo />
              </span>{" "}
              About
            </a>
            <a className="navbar-item" href="#" onClick={props.onOptionsClick}>
              <span className="icon is-medium">
                <IconCog />
              </span>{" "}
              Options
            </a>
            {props.isUndoEnabled && (
              <a className="navbar-item" href="#" onClick={props.onUndoClick}>
                <span className="icon is-medium">
                  <IconUndo />
                </span>{" "}
                Undo
              </a>
            )}
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                <span className="icon is-medium">
                  <IconPuzzle />
                </span>{" "}
                Samples
              </a>
              <div className="navbar-dropdown is-right">
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
          </div>
        </>
      }
    />
  );
}
