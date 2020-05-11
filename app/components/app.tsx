import * as _ from "lodash";
import * as React from "react";
import { Container, ContainerListItem } from "./containerListItem";
import { ContainerList } from "./ContainerItemList";
import * as io from "socket.io-client";

import { NewContainerDialog } from "./newContainerModal";
import { DialogTrigger } from "./dialogTrigger";

let socket = io.connect();

class AppState {
  containers?: Container[];
  stoppedContainers?: Container[];
}

export class AppComponent extends React.Component<{}, AppState> {
  containers: Container[] = [
    {
      id: "1",
      name: "test container",
      image: "some image",
      state: "running",
      status: "Running",
    },
    {
      id: "2",
      name: "another test container",
      image: "some image",
      state: "stopped",
      status: "Running",
    },
  ];
  constructor({}) {
    super({});

    const partitioned = _.partition(
      this.containers,
      (c) => c.state == "running"
    );

    this.state = {
      containers: [], //partitioned[0]
      stoppedContainers: [], //partitioned[1]
    };

    socket.on("containers.list", (containers: any) => {
      const partitioned = _.partition(
        containers,
        (c: any) => c.State == "running"
      );
      socket.on("image.error", (args: any) => {
        alert(args.message.json.message);
      });

      this.setState({
        containers: partitioned[0].map(this.mapContainer),
        stoppedContainers: partitioned[1].map(this.mapContainer),
      });
    });
  }

  mapContainer(container: any): Container {
    return {
      id: container.Id,
      name: _.chain(container.Names)
        .map((n: string) => n.substr(1))
        .join(", ")
        .value(),
      state: container.State,
      status: `${container.State} (${container.Status})`,
      image: container.Image,
    };
  }
  componentDidMount() {
    socket.emit("containers.list");
  }
  onRunImage(name: String) {
    socket.emit("image.run", { name: name });
  }
  render() {
    return (
      <div className="container">
        <h1 className="page-header">Docker Dashboard</h1>
        <div>
          <img
            src="/img/docker.png"
            alt="docker"
            width="32px"
            height="32px"
          ></img>
          <p style={{ fontSize: "8px", fontStyle: "italic" }}>
            image src:
            https://www.docker.com/sites/default/files/d8/2019-07/Moby-logo.png
          </p>
        </div>
        <DialogTrigger id="newContainerModal" buttonText="New container" />
        <ContainerList title="Running" containers={this.state.containers} />
        <ContainerList
          title="Stopped containers"
          containers={this.state.stoppedContainers}
        />
        <NewContainerDialog
          id="newContainerModal"
          onRunImage={this.onRunImage.bind(this)}
        />
      </div>
    );
  }
}
