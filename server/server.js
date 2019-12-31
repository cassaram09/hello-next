const express = require("express");
const next = require("next");
const Database = require("./database/database");

const env = process.env.NODE_ENV || "development";
const dev = env !== "production";
const config = require("./database/config/config.json")[env];

class Server {
  constructor() {
    this.app = next({ dev, dir: dev ? "./client" : undefined });
    this.handle = this.app.getRequestHandler();
    this.server = express();

    this.createRoutes = this.createRoutes.bind(this);
    this.connectToDatabase = this.connectToDatabase.bind(this);
    this.start = this.start.bind(this);

    this.database = undefined;
    return this;
  }

  createRoutes() {
    return new Promise(async (resolve, reject) => {
      try {
        this.server.get("/api/content", async (req, res) => {
          const posts = await this.database.models.Post.findAll();
          res.send(JSON.stringify(posts));
        });

        this.server.get("*", (req, res) => {
          return this.handle(req, res);
        });

        this.server.listen(3000, err => {
          if (err) throw err;
          console.log("> Ready on http://localhost:3000");
        });

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async connectToDatabase() {
    return new Promise(async (resolve, reject) => {
      try {
        this.database = await new Database(config).initialize();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  start() {
    this.app
      .prepare()
      .then(this.connectToDatabase)
      .then(this.createRoutes)
      .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
      });
  }
}

module.exports = Server;
