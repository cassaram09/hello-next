const express = require("express");
const jwt = require("jsonwebtoken");

class Controller {
  constructor({ name, model, authenticate }) {
    this.routes = express.Router();
    this.model = model;
    this.name = name;
    this.authenticate = authenticate;
    this.secret = process.env.JWT_SECRET;

    this.initializeRoutes = this.initializeRoutes.bind(this);
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);

    this.authenticateMiddleware = this.authenticateMiddleware.bind(this);

    this.initializeRoutes();

    return this;
  }

  initializeRoutes() {
    if (this.authenticate) {
      this.routes.use(this.authenticateMiddleware);
    }

    this.routes.get(`/${this.name}`, this.getAll);
    this.routes.delete(`/${this.name}/:id`, this.delete);
    this.routes.get(`/${this.name}/:id`, this.get);
    this.routes.post(`/${this.name}`, this.create);
    this.routes.patch(`/${this.name}/:id`, this.update);
  }

  authenticateMiddleware(req, res, next) {
    const tokenHttpOnly = req.cookies.tokenHttpOnly;
    const token = req.cookies.token;

    if (token && tokenHttpOnly) {
      jwt.verify(tokenHttpOnly, this.secret, (error, decoded) => {
        if (error) {
          res.status(401).redirect("/");
        } else {
          next();
        }
      });
    } else {
      res.status(401).redirect("/");
    }
  }

  async getAll(req, res, next) {
    const data = await this.model.findAll();
    res.send(data);
  }

  async get(req, res, next) {
    const resource = await this.model.findByPk(req.params.id);
    res.send(resource);
  }

  async create(req, res, next) {
    const data = req.body;
    const resource = await this.model.create(data);
    res.send(resource);
  }

  async update(req, res, next) {
    const data = req.body;
    // const resource = await this.model.upsert(data);
    res.send({});
  }

  async delete(req, res, next) {
    const data = req.body;
    // const resource = await this.model.destroy(data);
    res.send({});
  }
}

module.exports = Controller;
