const models = require("../models/index");
// API 키 목록
const API_KEYS = [
  process.env.YOUTUBE_API_KEY1,
  process.env.YOUTUBE_API_KEY2,
  process.env.YOUTUBE_API_KEY3,
];
let currentKeyIndex = 0;

const axios = require("axios");

/* GET /search */
exports.search = (req, res) => {
  res.render("search", { videos: null, error: null });
};

// API 키 순환 함수
function getNextApiKey() {
  const apiKey = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return apiKey;
}

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
          key: getNextApiKey(), // API 키 순환 적용
          pageToken: pageToken,
        },
      },
    );

    const { items, nextPageToken, prevPageToken } = response.data;

    const videos = items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.high.url,
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

    // API 키 변경 및 재시도
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    if (currentKeyIndex === 0) {
      return res.render("search", {
        videos: [],
        error:
          "YouTube API 키가 모두 소진되었습니다. 잠시 후 다시 시도해주세요.",
        query,
        nextPageToken: null,
        prevPageToken: null,
      });
    }

    return exports.searchVideo(req, res); // 다음 API 키로 재시도
  }
};
