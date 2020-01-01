const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

class Auth {
  constructor(database) {
    this.database = database;

    this.hashPassword = this.hashPassword.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.login = this.login.bind(this);

    return this;
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async checkPassword({ password, hash }) {
    return await bcrypt.compare(password, hash);
  }

  async login({ email, password }) {
    const user = await this.database.models.User.findOne({
      where: { email }
    });

    if (user) {
      const valid = await this.checkPassword({ password, hash: user.password });

      console.log("VALID", valid);
      return valid ? user : null;
    }

    return null;
  }
}

module.exports = Auth;
