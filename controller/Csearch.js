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
  console.log("검색어", req.query.keyword);
  const query = req.query.keyword;
  const pageToken = req.query.pageToken;
  const maxResults = 7;

  if (!query) {
    return res.render("search", {
      videos: [],
      error: "검색어를 입력해주세요.",
      query,
      nextPageToken: null,
      prevPageToken: null,
    });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          videoDuration: "medium",
          maxResults,
          key: YOUTUBE_API_KEY,
          pageToken: pageToken,
        },
      },
    );

    const { items, nextPageToken, prevPageToken } = response.data;

    const videos = items.map((item) => ({
      videoId: item.id.videoId, // 추가
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
    }));

    console.log("검색 결과 비디오 개수", videos.length);
    res.render("search", {
      videos,
      error: null,
      query,
      nextPageToken: nextPageToken || null,
      prevPageToken: prevPageToken || null,
    });
  } catch (err) {
    console.log("youtube api err", err.message);
    res.status(500).send("youtube api err");
  }
};
