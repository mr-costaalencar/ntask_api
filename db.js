const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

let db = null;

module.exports = (app) => {
  if (!db) {
    const config = app.libs.config;
    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        dialect: "sqlite",
        storage: "ntask.sqlite",
        define: {
          underscored: true,
        },
      }
    );
    db = {
      sequelize,
      Sequelize,
      models: {},
    };

    const dir = path.join(__dirname, "models");
    fs.readdirSync(dir).forEach((file) => {
      const modelDir = path.join(dir, file);
      const model = require(modelDir)(sequelize, Sequelize.DataTypes);
      db.models[model.name] = model;
    });
    Object.keys(db.models).forEach((key) => {
      db.models[key].associate(db.models);
    });
  }
  return db;
};
