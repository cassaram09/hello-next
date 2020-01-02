const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const Auth = require("./auth");
const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || "development";
const dev = env !== "production";
const cookieParser = require("cookie-parser");

class Server {
  constructor({ database, httpPort, httpsPort }) {
    this.secret = process.env.JWT_SECRET;
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
        this.server.use(cookieParser());
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
          const post = await this.models.Post.findByPk(req.params.id);
          res.send(post);
        });

        this.server.post("/api/posts", async (req, res) => {
          const data = req.body;

          const post = await this.models.Post.create(data);
          res.send(post);
        });

        this.server.post("/api/users", async (req, res) => {
          const auth = new Auth();
          const password = await auth.hashPassword(req.body.password);
          const user = await this.models.User.create({ ...req.body, password });
          res.send(user);
        });

        this.server.get("/api/users", async (req, res) => {
          const users = await this.models.User.findAll();
          res.send(JSON.stringify(users));
        });

        this.server.get("/admin/login", (req, res, next) => {
          const token = req.cookies.token;

          jwt.verify(token, this.secret, (error, decoded) => {
            if (error) {
              next();
            } else {
              res.redirect("/protected");
            }
          });
        });

        this.server.post("/login", async (req, res) => {
          let { email, password } = req.body;
          const user = await new Auth(this.database).login({ email, password });

          if (user) {
            const payload = user.get({ plain: true });
            const token = jwt.sign(payload, this.secret, { expiresIn: "24h" });
            res.send({ token, id: payload.id });
          } else {
            res.send({ error: "Incorrect email or password." });
          }
        });

        this.server.get("/protected", async (req, res) => {
          const token = req.cookies.token;

          jwt.verify(token, this.secret, (error, decoded) => {
            if (error) {
              res.status(401).send({ error: "Not authorized." });
            } else {
              res.send("I am a protected route.");
            }
          });
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
