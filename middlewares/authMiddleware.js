const jwt = require("jsonwebtoken");
const { User } = require("../models");

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.authToken; // 쿠키에서 토큰 가져오기

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "인증 토큰이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // 토큰 검증
    const user = await User.findOne({ where: { id: decoded.userId } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    req.user = user; // 인증된 사용자 정보를 요청 객체에 추가
    next(); // 요청 계속 처리
  } catch (error) {
    console.error("JWT 검증 실패:", error.message);
    return res.status(401).json({ success: false, message: "토큰 검증 실패." });
  }
};

module.exports = authenticateToken;
