const axios = require("axios");
const { Notes, Videos, User } = require("../models");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// GET detail
exports.detail = async (req, res) => {
  const videoId = req.query.videoId;

  if (!videoId) {
    return res.render("detail", {
      video: null,
      error: "비디오 ID가 없습니다.",
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

    let noteList = [];

    if (videoRecord) {
      noteList = await Notes.findAll({ where: { videoId: videoRecord.id } });
    }

    res.render("detail", { video, notes: noteList, error: null });
  } catch (err) {
    console.error("YouTube API 오류:", err.message);
    res.render("detail", {
      video: null,
      notes: null,
      error: "비디오 정보를 가져올 수 없습니다.",
    });
  }
};

// POST notes
exports.CreateNotes = async (req, res) => {
  try {
    const { ingredients, recipe, title, videoId, thumbnailUrl, channelTitle } =
      req.body;
    const user = req.user; // authenticateToken 미들웨어에서 설정
    console.log("썸네일", thumbnailUrl);
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
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};

// PATCH notes

exports.updateNote = async (req, res) => {
  const noteId = req.params.id;
  const { ingredients, recipe, title, videoId, thumbnailUrl, channelTitle } =
    req.body;
  const user = req.user; // authenticateToken 미들웨어에서 설정

  try {
    // 노트 조회
    const note = await Notes.findOne({ where: { id: noteId } });

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "노트를 찾을 수 없습니다." });
    }

    // 노트의 소유자 확인
    if (note.userId !== user.id) {
      return res
        .status(403)
        .json({ success: false, message: "권한이 없습니다." });
    }

    // 비디오 조회 또는 생성
    let video = await Videos.findOne({ where: { youtubeUrl: videoId } });
    if (!video) {
      video = await Videos.create({
        title: title,
        youtubeUrl: videoId,
        thumbnailUrl: thumbnailUrl,
        channelTitle: channelTitle,
      });
    }

    // 노트 업데이트
    await note.update({
      videoId: video.id,
      ingredients: ingredients,
      recipe: recipe,
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
        .json({ success: false, message: "노트를 찾을 수 없습니다." });
    }

    // 노트의 소유자 확인
    if (note.userId !== user.id) {
      return res
        .status(403)
        .json({ success: false, message: "권한이 없습니다." });
    }

    // 노트 삭제
    await note.destroy();

    res.json({ success: true, message: "노트가 성공적으로 삭제되었습니다." });
  } catch (err) {
    console.error("노트 삭제 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};
