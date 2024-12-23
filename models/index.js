"use strict";

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Videos = require("./Videos")(sequelize, Sequelize);
db.Notes = require("./Notes")(sequelize, Sequelize);
db.Favorites = require("./Favorites")(sequelize, Sequelize);

// User와 Notes: 1:N 관계
db.User.hasMany(db.Notes, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  constraints: true,
});
db.Notes.belongsTo(db.User, {
  foreignKey: "user_id",
});

// User와 Favorites: 1:N 관계
db.User.hasMany(db.Favorites, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  constraints: true,
});
db.Favorites.belongsTo(db.User, {
  foreignKey: "user_id",
});

// Videos와 Notes: 1:N 관계
db.Videos.hasMany(db.Notes, {
  foreignKey: "video_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  constraints: true,
});
db.Notes.belongsTo(db.Videos, {
  foreignKey: "video_id",
});

// Videos와 Favorites: 1:N 관계
db.Videos.hasMany(db.Favorites, {
  foreignKey: "video_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  constraints: true,
});
db.Favorites.belongsTo(db.Videos, {
  foreignKey: "video_id",
});

module.exports = db;
