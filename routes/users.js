const express = require("express");
const controller = require("../controller/Cusers");
const router = express.Router();

// GET
router.get("/", controller.users); // users
router.get("/login", controller.login); // login
router.get("/edit", controller.edit); // usersedit
router.get("/register", controller.register); // register

// POST

module.exports = router;
