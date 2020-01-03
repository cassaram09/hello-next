const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const Auth = require("./auth");
const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || "development";
const dev = env !== "production";
const cookieParser = require("cookie-parser");
const moment = require("moment");

const Controller = require("./controllers/controller");
const AdminController = require("./controllers/adminController");
const UserController = require("./controllers/userController");

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

    this.apiRoutes = this.apiRoutes.bind(this);
    this.adminRoutes = this.adminRoutes.bind(this);
    this.loginRoutes = this.loginRoutes.bind(this);

    return this;
  }

  initializeMiddleware() {
    return new Promise(async (resolve, reject) => {
      try {
        this.server.use(bodyParser.json());
        this.server.use(cookieParser());
        resolve();
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  // isAuthenticated(req, res, next) {
  //   const tokenHttpOnly = req.cookies.tokenHttpOnly;
  //   const token = req.cookies.token;

  //   if (token && tokenHttpOnly) {
  //     jwt.verify(tokenHttpOnly, this.secret, (error, decoded) => {
  //       if (error) {
  //         res.status(401).redirect("/");
  //       } else {
  //         next();
  //       }
  //     });
  //   } else {
  //     res.status(401).redirect("/");
  //   }
  // }

  apiRoutes() {
    Object.values(this.database.models).forEach(model => {
      let routes;

      if (model.name === "User") {
        routes = new UserController({
          name: model.name.toLowerCase() + "s",
          model: model,
          authenticate: true
        }).routes;
      } else {
        routes = new Controller({
          name: model.name.toLowerCase() + "s",
          model: model
        }).routes;
      }
      this.server.use("/api", routes);
    });
  }

  adminRoutes() {
    this.server.use(
      "/admin",
      new AdminController({
        authenticate: true
      }).routes
    );
  }

  loginRoutes() {
    this.server.post("/login", async (req, res) => {
      let { email, password } = req.body;
      const user = await new Auth(this.database).login({ email, password });

      if (user) {
        const plain = user.get({ plain: true });
        const payload = { id: plain.id };

        const token = jwt.sign(payload, this.secret, { expiresIn: "24h" });
        res.cookie("tokenHttpOnly", token, {
          maxAge: 900000,
          httpOnly: true
        });
        res.send({ token, id: payload.id });
      } else {
        res.send({ error: "Incorrect email or password." });
      }
    });

    this.server.post("/logout", async (req, res) => {
      const tokenHttpOnly = req.cookies.tokenHttpOnly;
      const token = req.cookies.token;

      if (token && tokenHttpOnly) {
        res.cookie("tokenHttpOnly", "", {
          maxAge: 900000,
          httpOnly: true,
          expires: moment().toDate()
        });

        return res.send({ success: true });
      }

      res.send({ success: false });
    });
  }

  initializeRoutes() {
    return new Promise(async (resolve, reject) => {
      try {
        this.apiRoutes();
        this.adminRoutes();
        this.loginRoutes();

        //catch all - let NextJS handle the request
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
