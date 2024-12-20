const models = require("../models/index");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Favorites, Videos } = require("../models"); // Favorite과 Video 모델을 가져옴

exports.favorites = async (req, res) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.render("favorites", { favoriteVideos: [] });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "토큰이 필요합니다." });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    console.log("userID", userId);

    // 데이터베이스에서 사용자별 즐겨찾기 데이터 가져오기
    const favoriteVideos = await Favorites.findAll({
      where: { userId: 1 }, // 사용자의 즐겨찾기 데이터만 가져옴
      include: [
        {
          model: Videos, // Favorite과 연결된 Video 모델 데이터 포함
          attributes: [
            "youtubeUrl",
            "thumbnailUrl",
            "title",
            "channelTitle",
            "description",
          ],
        },
      ],
    });

    // JSON 형식으로 클라이언트에 데이터 전달
    res.json({ success: true, favoriteVideos });
  } catch (error) {
    console.error("즐겨찾기 데이터 가져오기 실패:", error.message);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};
