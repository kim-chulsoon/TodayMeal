const models = require("../models/index");

/* GET /users */
exports.users = (req, res) => {
  res.render("users");
};

/* GET /users/login */
exports.login = (req, res) => {
  res.render("login");
};

/* GET /users/edit */
exports.edit = (req, res) => {
  res.render("usersedit");
};

/* GET /users/register */
exports.register = (req, res) => {
  res.render("register");
};
