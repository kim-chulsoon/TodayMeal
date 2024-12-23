const express = require("express");
const controller = require("../controller/Cfavorites");
const router = express.Router();
const authenticateToken = require("../middlewares/jwtAuth");

// GET
router.get("/", authenticateToken, controller.favorites); // favorites
// POST
router.post("/save", authenticateToken, controller.saveBookmark);
router.delete("/delete", authenticateToken, controller.deleteBookmark);
// POST
module.exports = router;
