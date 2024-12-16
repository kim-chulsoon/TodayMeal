const models = require("../models/index");

/* GET / */
exports.main = (req, res) => {
  res.render("main");
};

/* GET /loading */
exports.loading = (req, res) => {
  res.render("loading");
};
