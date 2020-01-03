const express = require("express");
const jwt = require("jsonwebtoken");

class AdminController {
  constructor(props) {
    props;

    this.routes = express.Router();
    this.secret = process.env.JWT_SECRET;

    this.initializeRoutes = this.initializeRoutes.bind(this);
    this.login = this.login.bind(this);
    this.initializeRoutes();

    return this;
  }

  initializeRoutes() {
    this.routes.get(`/login`, this.login);
  }

  // redirect users who are already logged in
  login(req, res, next) {
    const tokenHttpOnly = req.cookies.tokenHttpOnly;
    const token = req.cookies.token;

    if (token && tokenHttpOnly) {
      jwt.verify(tokenHttpOnly, this.secret, (error, decoded) => {
        if (error) {
          return next();
        } else {
          return res.redirect("/");
        }
      });
    }

    next();
  }
}

module.exports = AdminController;
