const express = require("express");
const controller = require("../controller/Cdetail.js");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");

// GET
router.get("/", authenticateToken, controller.detail); // detail
// POST
router.post("/notes", authenticateToken, controller.createOrUpdateNotes); // 메모 생성, 수정
router.delete("/notes/:id", authenticateToken, controller.deleteNote); // 메모 삭제
router.patch(
  "/notes/:id/ingredients",
  authenticateToken,
  controller.nullifyIngredients,
); // PATCH: ingredients
router.patch("/notes/:id/recipe", authenticateToken, controller.nullifyRecipe); // PATCH: recipe

module.exports = router;
