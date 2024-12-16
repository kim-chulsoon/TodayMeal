const express = require("express");
const controller = require("../controller/Csearch.js");
const router = express.Router();

// GET
router.get("/", controller.search); // search
router.get("/video", controller.searchVideo);

// POST

module.exports = router;
