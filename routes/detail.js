const express = require("express");
const controller = require("../controller/Cdetail.js");
const router = express.Router();

// GET
router.get("/", controller.detail); // detail
// POST

module.exports = router;
