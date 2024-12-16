const express = require("express");
const controller = require("../controller/Cvisitor.js");
const router = express.Router();

// GET
router.get("/", controller.main); // main
router.get("/users", controller.users); // users
router.get("/users/login", controller.login); // login
router.get("/users/edit", controller.edit); // usersedit
router.get("/search", controller.search); // search
router.get("/detail", controller.detail); // detail
router.get("/users/register", controller.register); // register
router.get("/favorites", controller.favorites); // favorites
router.get("/loading", controller.loading); // loading

// POST
module.exports = router;
