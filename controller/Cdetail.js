const axios = require("axios");
const { Notes, Videos, User } = require("../models");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// GET detail (변경 없음)
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

// POST notes (수정됨)
exports.Notes = async (req, res) => {
  try {
    const { ingredients, recipe, title, videoId } = req.body;
    const user = req.user; // authenticateToken 미들웨어에서 설정

    // Video 조회 또는 생성
    let video = await Videos.findOne({ where: { youtubeUrl: videoId } });
    if (!video) {
      video = await Videos.create({
        title: title,
        youtubeUrl: videoId,
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
    console.log("note upload err", err.message);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};
