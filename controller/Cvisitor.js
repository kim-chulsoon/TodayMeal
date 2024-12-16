const models = require("../models/index");

/* GET / */
exports.main = (req, res) => {
  res.render("main");
};

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

/* GET /search */
exports.search = (req, res) => {
  res.render("search");
};

/* GET /detail */
exports.detail = (req, res) => {
  res.render("detail");
};

/* GET /users/register */
exports.register = (req, res) => {
  res.render("register");
};

/* GET /favorites */
exports.favorites = (req, res) => {
  res.render("favorites");
};

/* GET /loading */
exports.loading = (req, res) => {
  res.render("loading");
};
