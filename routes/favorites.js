const express = require("express");
const controller = require("../controller/Cfavorites");
const router = express.Router();

// GET
router.get("/", controller.favorites); // favorites

// POST
module.exports = router;
