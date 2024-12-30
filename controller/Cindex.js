const models = require("../models/index");
const axios = require("axios");

// API 키 목록
const API_KEYS = [
  process.env.YOUTUBE_API_KEY1,
  process.env.YOUTUBE_API_KEY2,
  process.env.YOUTUBE_API_KEY3,
];
let currentKeyIndex = 0;

const keywords = [
  "한식 레시피",
  "중식 레시피",
  "일식 레시피",
  "간단 요리",
  "반찬",
  "양식 레시피",
];

// 간단한 캐시 객체
const cache = {};

// YouTube API 호출 함수
async function getYouTubeVideos(keyword) {
  // 캐싱된 결과가 있으면 반환
  if (cache[keyword]) {
    console.log(`캐싱된 결과 사용: ${keyword}`);
    return cache[keyword];
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: keyword,
          type: "video",
          videoDuration: "medium",
          maxResults: 12,
          key: API_KEYS[currentKeyIndex],
        },
      },
    );

    // 데이터 변환
    const videos = response.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.high.url,
    }));

    // 결과를 캐시에 저장
    cache[keyword] = videos;
    return videos;
  } catch (err) {
    console.error(
      `API 호출 실패 (키: ${API_KEYS[currentKeyIndex]}):`,
      err.message,
    );

    // API 키 변경
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;

    // 모든 키를 시도했음에도 실패하면 에러 반환
    if (currentKeyIndex === 0) {
      throw new Error("모든 API 키가 실패했습니다.");
    }

    // 다음 API 키로 재시도
    return getYouTubeVideos(keyword);
  }
}

/* GET / */
exports.main = async (req, res) => {
  try {
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

    // YouTube API 데이터 가져오기
    const videos = await getYouTubeVideos(randomKeyword);

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
