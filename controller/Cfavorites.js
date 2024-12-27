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

    return res.render("favorites", { success: true, favoriteVideos });
  } catch (error) {
    console.error("즐겨찾기 데이터 가져오기 실패:", error.message);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};

// 북마크 저장
exports.saveBookmark = async (req, res) => {
  const user = req.user;
  const { videoId } = req.body;

  try {
    // 비디오 데이터 확인
    const video = await Videos.findOne({
      where: { youtubeUrl: videoId },
    });

    if (!video) {
      return res
        .status(404)
        .json({ message: "해당 비디오를 찾을 수 없습니다." });
    }

    // 중복 방지: 사용자 ID와 비디오 ID를 조건으로 확인
    const existingFavorite = await Favorites.findOne({
      where: { userId: user.id, videoId: video.id },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "이미 북마크에 추가되었습니다." });
    }

    // 새 북마크 추가
    const favorite = await Favorites.create({
      userId: user.id,
      videoId: video.id,
    });

    return res
      .status(201)
      .json({ message: "북마크가 추가되었습니다.", favorite });
  } catch (error) {
    console.error("북마크 저장 중 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 북마크 삭제
exports.deleteBookmark = async (req, res) => {
  const user = req.user;
  const { videoId } = req.body;

  console.log("삭제 되나요!??", videoId);

  try {
    // 조인을 통해 삭제할 북마크 확인 및 삭제
    const favorite = await Favorites.findOne({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: Videos, // Videos 모델과 조인
          where: { youtubeUrl: videoId }, // youtubeUrl 조건
        },
      ],
    });

    if (!favorite) {
      return res.status(404).json({ message: "북마크가 존재하지 않습니다." });
    }

    // 북마크 삭제
    await favorite.destroy();

    return res.status(200).json({ message: "북마크가 삭제되었습니다." });
  } catch (error) {
    console.error("북마크 삭제 중 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

/** GET /favorites/status  */
// 즐겨찾기 상태 확인 컨트롤러

/** GET /favorites/status  */
// 즐겨찾기 상태 확인 컨트롤러
exports.checkFavoriteStatus = async (req, res) => {
  const { videoId } = req.query; // 클라이언트에서 보낸 videoId 파라미터
  console.log("즐겨찾기 VideoID", videoId);
  const userId = req.user.id; // 로그인된 사용자 ID (미들웨어로부터 전달받음)

  try {
    // 조인을 통해 즐겨찾기 상태 확인
    const favorite = await Favorites.findOne({
      where: {
        userId: userId, // 로그인된 사용자 ID 조건
      },
      include: [
        {
          model: Videos, // Videos 모델과 조인
          where: { youtubeUrl: videoId }, // Videos 테이블의 youtubeUrl 조건
        },
      ],
    });

    // 결과 반환
    if (favorite) {
      res.status(200).json({ isBookmarked: true }); // 북마크된 상태
    } else {
      res.status(200).json({ isBookmarked: false }); // 북마크되지 않은 상태
    }
  } catch (error) {
    console.error("즐겨찾기 상태 확인 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "즐겨찾기 상태 확인 중 오류가 발생했습니다." });
  }
};
