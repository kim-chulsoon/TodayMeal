const express = require("express");
const controller = require("../controller/Cdetail.js");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

// GET
router.get("/", controller.detail); // detail
// POST
router.post("/notes", authenticateToken, controller.Notes);

module.exports = router;
