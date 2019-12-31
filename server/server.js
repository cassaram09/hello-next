const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const env = process.env.NODE_ENV || "development";
const dev = env !== "production";

class Server {
  constructor({ database, httpPort, httpsPort }) {
    this.app = next({ dev, dir: dev ? "./client" : undefined });
    this.handle = this.app.getRequestHandler();
    this.database = database;
    this.server = express();

    this.models = this.database.models;

    this.initializeRoutes = this.initializeRoutes.bind(this);
    this.initializeMiddleware = this.initializeMiddleware.bind(this);
    this.start = this.start.bind(this);

    return this;
  }
  initializeMiddleware() {
    return new Promise(async (resolve, reject) => {
      try {
        this.server.use(bodyParser.json()); // Prases incoming data as JSON

        resolve();
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  initializeRoutes() {
    return new Promise(async (resolve, reject) => {
      try {
        this.server.get("/api/posts", async (req, res) => {
          const posts = await this.models.Post.findAll();
          res.send(JSON.stringify(posts));
        });

        this.server.get("/api/posts/:id", async (req, res) => {
          console.log(req.params);
          const post = await this.models.Post.findByPk(req.params.id);
          res.send(post);
        });

        this.server.post("/api/posts", async (req, res) => {
          const data = req.body;

          const post = await this.models.Post.create(data);
          console.log(post);
          res.send(post);
        });

        this.server.get("*", (req, res) => this.handle(req, res));

        this.server.listen(3000, err => {
          if (err) throw err;
          console.log("Ready on http://localhost:3000");
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
      .then(this.initializeMiddleware)
      .then(this.initializeRoutes)
      .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
      });
  }
}

module.exports = Server;
