const models = require("../models/index");
// youtube api key
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const axios = require("axios");

/* GET /search */
exports.search = (req, res) => {
  res.render("search", { videos: null, error: null });
};

/* GET /video/search */
exports.searchVideo = async (req, res) => {
  const query = req.query.content;
  const maxResults = req.query.maxResults || 5;

  if (!query) {
    return res.status(400).json({ message: "검색어를 입력해주세요" });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults,
          key: YOUTUBE_API_KEY,
        },
      },
    );

    const videos = response.data.items.map((item) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
    }));

    res.render("search", { videos, error: null });
  } catch (err) {
    console.log("youtube api err", err);
    res.status(500).send("youtube api err");
  }
};
