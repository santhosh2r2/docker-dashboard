let Docker = require("dockerode");
let isWindows = process.platform === "win32";

let options = {};
/*
if (isWindows) {
  options = {
    host: "0.0.0.0",
    port: 5555,
  };
} else {
  options = {
    socketPath: "/var/run/docker.sock",
  };
}
*/
options = {
    host: "0.0.0.0",
    port: 5555,
  };

module.exports = new Docker(options);

/* 

NOTE: This is not applicable for Docker For Windows

Activating Docker API for the Ubuntu docker-engine as follows

sudo edit /lib/systemd/system/docker.service 
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock -H=tcp://0.0.0.0:5555
systemctl daemon-reload 
sudo service docker restart 

*/
