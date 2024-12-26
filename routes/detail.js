const express = require("express");
const controller = require("../controller/Cdetail.js");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

// GET
router.get("/", controller.detail); // detail
// POST
router.post("/notes", authenticateToken, controller.createOrUpdateNotes); // 메모 생성, 수정
router.delete("/notes/:id", authenticateToken, controller.deleteNote); // 메모 삭제

module.exports = router;
