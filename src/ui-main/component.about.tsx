import * as React from "react";
import { Component } from "react";
import { ModalComponent } from "src/ui-components/modal.component";

export interface Props {
  visible?: boolean;
  onClose(): void;
}

export interface State {}

export class AboutComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleCloseModal = () => {
    this.props.onClose();
  };

  render() {
    return (
      <ModalComponent
        title={"About"}
        show={this.props.visible}
        onClose={this.handleCloseModal}
        hideFooter
        body={
          <div className="options-modal-body">
            <div className="content">
              <p>
                <strong>Linked graph</strong> is a demo Web application which
                allows to build, edit and view linked graph data structures. One
                of important functionalities is a <i>live layout</i> which
                adjusts positions of objects based on link constraints between
                them.
              </p>
              <p>Features:</p>
              <ul>
                <li>Adding new objects and connections.</li>
                <li>Move object with drag and drop.</li>
                <li>Editing of objects and managing connections.</li>
                <li>Automatic live graph force layout.</li>
                <li>Displaying link directions and text.</li>
                <li>Zooming and panning.</li>
                <li>Mobile friendly.</li>
                <li>Possibility to undo 5 last operations.</li>
              </ul>
              <hr />
              <p>
                This software is implemented as open source. Main repository is
                located on{" "}
                <a href="https://github.com/megaboich/linked-graph">Github</a>.
              </p>
              <p>Used 3rd party libraries and assets:</p>
              <ul>
                <li>
                  <a href="https://github.com/tgdwyer/WebCola">Webcola</a> is a
                  JavaScript constraint-based graph layout library.
                </li>
                <li>
                  <a href="https://reactjs.org/">React</a> is a JavaScript
                  library for building user interfaces.
                </li>
                <li>
                  <a href="https://redux.js.org/">Redux</a> is a predictable
                  state container for JavaScript apps.
                </li>
                <li>
                  <a href="https://react-select.com/home">React Select</a> is a
                  flexible and beautiful Select Input control for ReactJS with
                  multiselect, autocomplete, async and creatable support.
                </li>
                <li>
                  <a href="https://github.com/jgthms/bulma">Bulma</a> is a free,
                  open source CSS framework based on Flexbox.
                </li>
                <li>
                  <a href="https://github.com/iconic/open-iconic">
                    Open iconic
                  </a>{" "}
                  is an open source icon set with 223 marks in SVG, webfont and
                  raster formats.
                </li>
              </ul>
            </div>
          </div>
        }
      />
    );
  }
}
