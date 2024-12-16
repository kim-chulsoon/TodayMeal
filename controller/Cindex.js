const models = require("../models/index");

/* GET / */
exports.main = (req, res) => {
  res.render("main");
};

/* GET /search */
exports.search = (req, res) => {
  res.render("search");
};

/* GET /detail */
exports.detail = (req, res) => {
  res.render("detail");
};

/* GET /loading */
exports.loading = (req, res) => {
  res.render("loading");
};
