const express = require("express");
const next = require("next");

const env = process.env.NODE_ENV || "development";
const dev = env !== "production";

class Server {
  constructor({ database, httpPort, httpsPort }) {
    this.app = next({ dev, dir: dev ? "./client" : undefined });
    this.handle = this.app.getRequestHandler();
    this.database = database;
    this.server = express();

    this.models = this.database.models;

    this.createRoutes = this.createRoutes.bind(this);
    this.start = this.start.bind(this);

    return this;
  }

  createRoutes() {
    return new Promise(async (resolve, reject) => {
      try {
        this.server.get("/api/content", async (req, res) => {
          const posts = await this.models.Post.findAll();
          res.send(JSON.stringify(posts));
        });

        this.server.get("*", (req, res) => this.handle(req, res));

        this.server.listen(3000, err => {
          if (err) throw err;
          console.log("> Ready on http://localhost:3000");
        });

        resolve();
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  start() {
    this.app
      .prepare()
      .then(this.createRoutes)
      .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
      });
  }
}

module.exports = Server;
