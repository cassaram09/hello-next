const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

class Database {
  /**
   * Inistatiates the DB class
   *
   */
  constructor(config) {
    this.config = config;
    this.Sequelize = Sequelize;
    this.connection = undefined;
    this.models = {};

    this.modelsDirectory = __dirname + "/models";

    this.initialize = this.initialize.bind(this);
    this.connect = this.connect.bind(this);
    this.importModels = this.importModels.bind(this);

    return this;
  }

  async initialize() {
    this.connection = await this.connect(this.config);
    this.models = this.importModels();
    return this;
  }

  async connect(config) {
    try {
      const sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      );

      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      return sequelize;
    } catch (err) {
      console.log("Unable to connect to the database:", err);
    }
  }

  importModels() {
    const models = fs.readdirSync(this.modelsDirectory).reduce((sum, file) => {
      const model = this.connection["import"](path.join(modelsDirectory, file));

      sum[model.name] = model;

      if (model.associate) {
        model.associate(sum);
      }

      return sum;
    }, {});

    console.log("Models imported.");

    return models;
  }
}

module.exports = Database;
