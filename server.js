let express = require("express");
let path = require("path");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let docker = require("./dockerapi");

// Use the environment port if available, or default to 3000
let port = process.env.PORT || 3001;

// Serve static files from /public
app.use(express.static("public"));

// Create an endpoint which just returns the index.html page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Start the server
server.listen(port, () =>
  console.log(`Server started on port ${port}` + `  http://localhost:${port}`)
);

io.on("connection", (socket) => {
  socket.on("containers.list", () => {
    console.log("docker: " + docker.info());
    
    refreshContainers();
  });
  socket.on("container.start", (args) => {
    const container = docker.getContainer(args.id);

    if (container) {
      container.start((err, data) => refreshContainers());
    }
  });
  socket.on("container.stop", (args) => {
    const container = docker.getContainer(args.id);

    if (container) {
      container.stop((err, data) => refreshContainers());
    }
  });
  socket.on("image.run", (args) => {
    docker.createContainer({ Image: args.name }, (err, container) => {
      refreshContainers();
      if (!err)
        container.start((err, data) => {
          if (err) socket.emit("image.error", { message: err });
        });
      else socket.emit("image.error", { message: err });
    });
  });
});

setInterval(refreshContainers, 2000);

function refreshContainers() {
  //console.log("docker: " + docker.info());

  docker.listContainers({ all: true }, (err, containers) => {
    //console.log("containers: " + containers);

    io.emit("containers.list", containers);
  });
}
