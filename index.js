require("dotenv").config();

const Server = require("./server/server");
const Database = require("./server/database/database");

async function run() {
  const database = await new Database().initialize();

  new Server({
    port: process.env.HTTP_PORT,
    sslPort: process.env.HTTPS_PORT,
    env: process.env.NODE_ENV || "development",
    database
  }).start();
}

run();
