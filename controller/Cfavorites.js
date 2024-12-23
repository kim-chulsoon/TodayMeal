const models = require("../models/index");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Favorites, Videos } = require("../models"); // Favorite과 Video 모델을 가져옴

exports.favorites = async (req, res) => {
  try {
    const user = req.user || null; // req.user가 없으면 null로 설정

    if (!user) {
      // 사용자 정보가 없을 경우 빈 데이터 반환
      return res.render("favorites", { favoriteVideos: [] });
    }

    const userId = user.id; // 사용자 ID 추출

    // 사용자별 즐겨찾기 데이터 가져오기
    const favoriteVideos = await Favorites.findAll({
      where: { userId },
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

    return res.status(200).json({ success: true, favoriteVideos });
  } catch (error) {
    console.error("즐겨찾기 데이터 가져오기 실패:", error.message);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};
