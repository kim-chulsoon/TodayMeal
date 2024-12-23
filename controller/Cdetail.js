const axios = require("axios");
const { Notes, Videos, User } = require("../models");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// GET detail
exports.detail = async (req, res) => {
  const videoId = req.query.videoId;
  const user = req.user;

  if (!videoId) {
    return res.render("detail", {
      video: null,
      error: "비디오 ID가 없습니다.",
      user: user,
      note: null,
    });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,contentDetails,statistics",
          id: videoId,
          key: YOUTUBE_API_KEY,
        },
      },
    );

    const item = response.data.items[0];
    if (!item) {
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

    const videoRecord = await Videos.findOne({
      where: { youtubeUrl: videoId },
    });

    let note = null;

    if (videoRecord && user) {
      note = await Notes.findAll({
        where: { videoId: videoRecord.id, userId: user.id },
      });
    }

    res.render("detail", { video, note, error: null, user });
  } catch (err) {
    console.error("YouTube API 오류:", err.message);
    res.render("detail", {
      video: null,
      note: null,
      error: "비디오 정보를 가져올 수 없습니다.",
      user: user,
    });
  }
};

// POST notes
exports.CreateNotes = async (req, res) => {
  try {
    const { ingredients, recipe, title, videoId, thumbnailUrl, channelTitle } =
      req.body;
    const user = req.user; // authenticateToken 미들웨어에서 설정

    // Video 조회 또는 생성
    let video = await Videos.findOne({ where: { youtubeUrl: videoId } });
    if (!video) {
      video = await Videos.create({
        title: title,
        youtubeUrl: videoId,
        thumbnailUrl: thumbnailUrl,
        channelTitle: channelTitle,
      });
    }

    // 노트 확인
    let existingNotes = await Notes.findOne({
      where: { videoId: video.id, userId: user.id },
    });

    if (existingNotes) {
      return res.status(400).json({
        success: false,
        message: "이미 메모가 존재합니다. 수정하시겠습니까?",
      });
    }

    // Notes 생성
    await Notes.create({
      userId: user.id,
      videoId: video.id,
      ingredients: ingredients,
      recipe: recipe,
    });

    res
      .status(201)
      .json({ success: true, message: "메모가 성공적으로 저장되었습니다." });
  } catch (err) {
    console.error("note upload err:", err); // 전체 오류 객체를 로그로 남김
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
};

// PATCH notes

exports.updateNote = async (req, res) => {
  const noteId = req.params.id;
  const { ingredients, recipe, title, videoId, thumbnailUrl, channelTitle } =
    req.body;
  const user = req.user; // authenticateToken 미들웨어에서 설정

  try {
    // 메모모 조회
    const note = await Notes.findOne({ where: { id: noteId } });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "메모를 찾을 수 없습니다." });
    }

    // 메모의 소유자 확인
    if (note.userId !== user.id) {
      return res
        .status(403)
        .json({ success: false, message: "권한이 없습니다." });
    }

    // 노트 업데이트
    await note.update({
      ingredients: ingredients !== undefined ? ingredients : note.ingredients,
      recipe: recipe !== undefined ? recipe : note.recipe,
    });

    res.json({
      success: true,
      message: "노트가 성공적으로 업데이트되었습니다.",
    });
  } catch (err) {
    console.error("노트 업데이트 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};

// DELETE notes

exports.deleteNote = async (req, res) => {
  const noteId = req.params.id;
  const user = req.user; // authenticateToken 미들웨어에서 설정

  try {
    // 노트 조회
    const note = await Notes.findOne({ where: { id: noteId } });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "메모를 찾을 수 없습니다." });
    }

    // 노트의 소유자 확인
    if (note.userId !== user.id) {
      return res
        .status(403)
        .json({ success: false, message: "권한이 없습니다." });
    }

    // 노트 삭제
    await note.destroy();

    res.json({ success: true, message: "메모가 성공적으로 삭제되었습니다." });
  } catch (err) {
    console.error("노트 삭제 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};
