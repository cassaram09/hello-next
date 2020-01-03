const Controller = require("./controller");
const Auth = require("../auth");

class UserController extends Controller {
  constructor({ name, model }) {
    super({ name, model, authenticate: true });

    return this;
  }

  async getAll(req, res, next) {
    res.send([]);
  }

  async get(req, res, next) {
    if (`${this.decoded.id}` === `${req.params.id}`) {
      const user = await this.model.findByPk(req.params.id);
      res.send(user);
    } else {
      res.status(403).send({});
    }
  }

  async create(req, res, next) {
    const auth = new Auth();
    const password = await auth.hashPassword(req.body.password);
    const user = await this.model.create({ ...req.body, password });
    res.send(user);
  }
}

module.exports = UserController;
