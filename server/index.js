const setting = require("./settings.json");

if (process.env.NODE_ENV === "production") {
  require("newrelic");
}

const express = require("express");

const routers = {
  api: require("./api/router"),
};

const server = express();
const NODE_PORT = parseInt(setting.port, 10);

server.use("/api", routers.api);

server.listen(NODE_PORT, () => {
  console.log(
    `Server listening on port ${NODE_PORT} in ${process.env.NODE_ENV} mode...`
  );
});
