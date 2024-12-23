const jwt = require("jsonwebtoken");
const { User } = require("../models");
// require("dotenv").config(); // app.js에서 이미 설정되었으므로 제거

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization 헤더가 필요합니다." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "토큰이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ where: { id: decoded.userId } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    req.user = user; // 요청 객체에 사용자 정보 추가
    next();
  } catch (error) {
    console.error("JWT 검증 실패:", error.message);
    return res.status(401).json({ success: false, message: "토큰 검증 실패." });
  }
};

module.exports = authenticateToken;
