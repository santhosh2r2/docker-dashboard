import * as React from "react";
import * as classNames from "classnames";
import * as io from "socket.io-client";

let socket = io.connect();

export interface Container {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
}

export class ContainerListItem extends React.Component<Container, {}> {
  // Helper method for determining whether the container is running or not
  isRunning() {
    return this.props.state === "running";
  }
  onActionButtonClick() {
    const evt = this.isRunning() ? "container.stop" : "container.start";
    socket.emit(evt, { id: this.props.id });
  }

  render() {
    const panelClass = this.isRunning() ? "success" : "default";
    const classes = classNames("bg", `bg-${panelClass}`);
    const buttonText = this.isRunning() ? "Stop" : "Start";

    return (
      <div className="card mx-2 mb-3" style={{ width: "18rem" }}>
        <div
          className={
            "card-header text-center font-weight-bold d-flex justify-content-between " +
            classes
          }
        >
          {this.props.name}
        </div>
        <div className="card-body">
          Status: {this.props.status}
          <br />
          Image: {this.props.image}
        </div>
        <div className="card-footer">
          <button
            onClick={this.onActionButtonClick.bind(this)}
            className="btn btn-primary"
          >
            {buttonText}
          </button>
        </div>
      </div>
    );
  }
}
