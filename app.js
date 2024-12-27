const express = require("express");
const app = express();
const db = require("./models");
require("dotenv").config();
const PORT = process.env.PORT;
const multer = require("multer");
const session = require("express-session");
const cookieParser = require("cookie-parser");
// 쿠키 파서 설정
app.use(cookieParser()); // 쿠키 파서 등록

// 미들웨어
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use("/static", express.static(__dirname + "/static"));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  }),
);

// Multer 설정
const upload = multer({
  dest: "uploads/",
});
app.use("/uploads", express.static("uploads"));

// 라우터
const indexRouter = require("./routes");
const favoritesRouter = require("./routes/favorites");
const searchRouter = require("./routes/search");
const usersRouter = require("./routes/users");
const detailRouter = require("./routes/detail");
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/favorites", favoritesRouter);
app.use("/detail", detailRouter);
app.use("/search", searchRouter);

//  404
app.get("*", (req, res) => {
  res.status(404).render("404");
});
db.sequelize.sync({ force: false }).then((result) => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});

// app.listen(PORT, () => {
//   console.log(`http://localhost:${PORT}`);
// });
