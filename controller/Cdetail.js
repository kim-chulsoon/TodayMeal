const axios = require("axios");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

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

    res.render("detail", { video, error: null });
  } catch (err) {
    console.error("YouTube API 오류:", err.message);
    res.render("detail", {
      video: null,
      error: "비디오 정보를 가져올 수 없습니다.",
    });
  }
};
