const models = require("../models/index");
const axios = require("axios");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const keywords = [
  "한식 레시피",
  "중식 레시피",
  "일식 레시피",
  "간단 요리",
  "반찬",
  "양식 레시피",
];
/* GET / */
exports.main = async (req, res) => {
  try {
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    // YouTube API 호출
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: randomKeyword,
          type: "video",
          videoDuration: "medium",
          maxResults: 12,
          key: YOUTUBE_API_KEY,
        },
      },
    );

    // 데이터 변환
    const videos = response.data.items.map((item) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.high.url,
    }));

    console.log("랜덤 요리 동영상 데이터:", videos);

    // 데이터를 main.ejs로 전달
    res.render("main", { videos });
  } catch (err) {
    console.error("YouTube API 호출 오류:", err.message);
    res.render("main", { videos: [] }); // 오류 발생 시 빈 배열 전달
  }
};

/* GET /loading */
exports.loading = (req, res) => {
  res.render("loading");
};
