const axios = require("axios");
const { Notes, Videos, User } = require("../models");

// API 키 목록
const API_KEYS = [
  process.env.YOUTUBE_API_KEY1,
  process.env.YOUTUBE_API_KEY2,
  process.env.YOUTUBE_API_KEY3,
];
let currentKeyIndex = 0;

// 간단한 캐시 객체
const cache = {};

// API 키 순환 함수
function getNextApiKey() {
  const apiKey = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return apiKey;
}

// GET detail
exports.detail = async (req, res) => {
  const videoId = req.query.videoId;
  const user = req.user || null;
  console.log("User:", user);
  if (!videoId) {
    console.log("Video ID가 없습니다.");
    return res.render("detail", {
      video: null,
      error: "비디오 ID가 없습니다.",
      user: user,
      note: null,
    });
  }

  console.log("tttt", cache[videoId]);
  // 캐싱된 결과가 있으면 반환

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,contentDetails,statistics",
          id: videoId,
          key: getNextApiKey(),
        },
      },
    );

    const item = response.data.items[0];
    if (!item) {
      console.log(`비디오를 찾을 수 없습니다: ${videoId}`);
      return res.render("detail", {
        video: null,
        error: "해당 비디오를 찾을 수 없습니다.",
        user: user,
        note: null,
      });
    }

    const video = {
      videoId: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount || 0,
    };

    // Video 조회
    const videoRecord = await Videos.findOne({
      where: { youtubeUrl: videoId },
    });

    let note = null;

    if (videoRecord && user) {
      note = await Notes.findOne({
        where: { videoId: videoRecord.id, userId: user.id },
      });
      console.log("조회된 노트:", note);
    } else {
      console.log("비디오 레코드나 사용자가 없습니다.");
      note = {
        id: null,
        ingredients: "",
        recipe: "",
      };
    }

    // 캐시에 저장
    cache[videoId] = { video, note };
    console.log("cacheeeee", cache);
    if (cache[videoId]) {
      console.log(`캐싱된 결과 사용: ${videoId}`);
      console.log("캐시된 노트:", cache[videoId].note);
      return res.render("detail", {
        video: cache[videoId].video,
        note: cache[videoId].note || null,
        error: null,
        user,
      });
    }
    res.render("detail", { video, note, error: null, user });
  } catch (err) {
    console.error("YouTube API 오류:", err.message);

    // API 키 순환 및 재시도
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    if (currentKeyIndex === 0) {
      return res.render("detail", {
        video: null,
        note: null,
        error: "비디오 정보를 가져올 수 없습니다.",
        user: user,
      });
    }

    return exports.detail(req, res); // 다음 API 키로 재시도
  }
};

// POST Notes
exports.createOrUpdateNotes = async (req, res) => {
  try {
    // 요청 본문에서 데이터 추출
    const { ingredients, recipe, title, videoId, thumbnailUrl, channelTitle } =
      req.body;
    const user = req.user; // authenticateToken 미들웨어에서 설정된 사용자 정보

    // 비디오 정보 조회 또는 생성
    let video = await Videos.findOne({ where: { youtubeUrl: videoId } });
    if (!video) {
      video = await Videos.create({
        title,
        youtubeUrl: videoId,
        thumbnailUrl,
        channelTitle,
      });
    }

    // 기존 노트 조회
    let existingNote = await Notes.findOne({
      where: { videoId: video.id, userId: user.id },
    });

    // 노트 생성 또는 업데이트
    if (!existingNote) {
      // 기존 노트가 없으면 새로 생성
      const newNote = await Notes.create({
        userId: user.id,
        videoId: video.id,
        ingredients: ingredients || "", // 전달된 값이 없으면 빈 문자열
        recipe: recipe || "", // 전달된 값이 없으면 빈 문자열
      });
      return res.status(201).json({
        success: true,
        message: "메모가 생성되었습니다.",
        note: newNote,
      });
    } else {
      // 기존 노트가 있으면 업데이트
      await existingNote.update({
        ingredients:
          ingredients !== undefined ? ingredients : existingNote.ingredients, // 전달된 값이 없으면 기존 값 유지
        recipe: recipe !== undefined ? recipe : existingNote.recipe, // 전달된 값이 없으면 기존 값 유지
      });
      return res.status(200).json({
        success: true,
        message: "메모가 업데이트되었습니다.",
        note: existingNote,
      });
    }
  } catch (err) {
    console.error("createOrUpdateNotes 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error: err.message,
    });
  }
};

// PATCH nullifyIngredients
exports.nullifyIngredients = async (req, res) => {
  const noteId = req.params.id;
  const user = req.user; // authenticateToken 미들웨어에서 설정된 사용자 정보
  console.log("서버 노트 id", noteId);
  try {
    // 노트 조회
    const note = await Notes.findOne({
      where: { id: noteId, userId: user.id },
    });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "메모를 찾을 수 없습니다." });
    }

    // 'ingredients' 필드를 null로 설정
    note.ingredients = null;
    await note.save();

    return res.status(200).json({
      success: true,
      message: "재료 메모가 성공적으로 삭제되었습니다.",
      note,
    });
  } catch (err) {
    console.error("재료 메모 삭제 오류:", err);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류: " + error.message });
  }
};

// PATCH nullifyRecipe
exports.nullifyRecipe = async (req, res) => {
  const noteId = req.params.id;
  const user = req.user; // authenticateToken 미들웨어에서 설정된 사용자 정보

  try {
    // 노트 조회
    const note = await Notes.findOne({
      where: { id: noteId, userId: user.id },
    });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "메모를 찾을 수 없습니다." });
    }

    // 'recipe' 필드를 null로 설정
    note.recipe = null;
    await note.save();

    return res.status(200).json({
      success: true,
      message: "레시피 메모가 성공적으로 삭제되었습니다.",
      note,
    });
  } catch (err) {
    console.error("레시피 메모 삭제 오류:", err);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

// DELETE notes
exports.deleteNote = async (req, res) => {
  const user = req.user; // authenticateToken 미들웨어에서 설정
  const { videoId } = req.body; // 클라이언트에서 전달된 videoId

  try {
    if (!videoId) {
      return res
        .status(400)
        .json({ success: false, message: "videoId가 필요합니다." });
    }

    // Video 테이블에서 youtubeUrl과 일치하는 Video ID 가져오기
    const video = await Videos.findOne({ where: { youtubeUrl: videoId } });

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "해당 비디오를 찾을 수 없습니다." });
    }

    // 해당 videoId(Video ID)와 userId에 해당하는 노트 조회
    const notes = await Notes.findAll({
      where: { videoId: video.id, userId: user.id },
    });

    if (!notes.length) {
      return res
        .status(404)
        .json({ success: false, message: "삭제할 메모가 없습니다." });
    }

    // 노트 삭제
    await Notes.destroy({ where: { videoId: video.id, userId: user.id } });

    res.json({
      success: true,
      message: "모든 메모가 성공적으로 삭제되었습니다.",
    });
  } catch (err) {
    console.error("노트 삭제 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};
