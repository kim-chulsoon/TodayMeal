const express = require("express");
const app = express();
// const db = require("./models");no
require("dotenv").config();
const PORT = process.env.PORT;

// 미들웨어어
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/static", express.static(__dirname + "/static"));

// 라우터
const indexRouter = require("./routes");
app.use("/", indexRouter);

//  404
app.get("*", (req, res) => {
  res.render("404");
});

// db.sequelize.sync({ force: false }).then((result) => {
//   app.listen(PORT, () => {
//     console.log(`http://localhost:${PORT}`);
//   });
// });

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
