const express = require("express");
const controller = require("../controller/Cusers");
const router = express.Router();
const uploadDetail = require("../middlewares/uploadDetail"); // Multer 설정 파일
// GET
router.get("/", controller.users); // users
router.get("/login", controller.login); // login
router.get("/edit", controller.edit); // usersedit
router.get("/register", controller.register); // register
router.get("/edit/details", controller.userProfile);

// POST
router.post("/login", controller.userLogin); //login post
router.post("/register", controller.userRegister); //register post
router.post("/registerIdCheck", controller.checkUserId);
router.post(
  "/dynamicUpload",
  uploadDetail.single("dynamicFile"),
  controller.dynamicUpload,
);

//PATCH
router.patch("/", controller.updateUserInfo);

module.exports = router;
