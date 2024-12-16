const express = require("express");
const controller = require("../controller/Cvisitor.js");
const router = express.Router();

router.get("/", controller.main);

module.exports = router;
