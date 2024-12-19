const multer = require("multer");
const path = require("path");

// 파일 저장 위치 및 파일명 설정 예시
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // uploads 폴더가 없으면 생성 필요
  },
  filename: (req, file, cb) => {
    // 고유한 파일명을 위해 날짜+원본이름 사용
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// 이미지 파일 형식 필터 예시 (선택사항)
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("이미지 파일만 업로드 가능합니다."), false);
  }
  cb(null, true);
};

const uploadDetail = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한 예시
});

module.exports = uploadDetail;
