const models = require("../models/index");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models"); // User 모델 가져오기

// JWT 시크릿 키
const SECRET_KEY = process.env.SECRET_KEY;

/* GET /users */
exports.users = (req, res) => {
  res.render("users");
};

/* GET /users/login */
exports.login = (req, res) => {
  res.render("login");
};

/* GET /users/edit */
exports.edit = (req, res) => {
  res.render("usersedit");
};

/* GET /users/register */
exports.register = (req, res) => {
  res.render("register");
};

/** 사용자 정보 조회 */
exports.userProfile = async (req, res) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization 헤더가 필요합니다." });
    }

    const token = authHeader.split(" ")[1]; // Bearer Token 형식
    console.log("Authorization Header:", authHeader);
    console.log("토큰값:", token);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "토큰이 필요합니다." });
    }

    // 토큰 검증 및 사용자 ID 추출
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      console.error("JWT 검증 실패:", error.message);
      return res
        .status(401)
        .json({ success: false, message: "토큰 검증 실패: " + error.message });
    }

    const userId = decoded.userId; // 토큰 페이로드의 userId 추출
    console.log("유저id", userId);

    // User 테이블에서 사용자 정보 조회
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "userId", "name", "birthdate"], // 반환할 필드 지정
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
    }

    // 사용자 정보 반환
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};

//회원가입
exports.userRegister = async (req, res) => {
  try {
    const { userId, userPw, userName, userBirth } = req.body; // 요청 데이터 구조에 맞게 수정
    console.log(userName, userBirth);

    // 필수 항목 체크
    if (!userId || !userPw || !userName || !userBirth) {
      return res
        .status(400)
        .json({ message: "모든 필수 항목을 입력해주세요." });
    }

    // 아이디 중복 체크
    const existingUser = await User.findOne({ where: { userId } });
    if (existingUser) {
      return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPw, saltRounds);

    // 사용자 생성
    const newUser = await User.create({
      userId,
      userPw: hashedPassword,
      name: userName,
      birthdate: userBirth,
    });

    res.status(201).json({
      message: "회원가입 성공!",
      userId: newUser.userId,
      success: true,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "서버 오류", error: error.message });
  }
};

// 중복 아이디 체크
exports.checkUserId = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ message: "아이디를 입력해주세요." });
    }

    const existingUser = await User.findOne({ where: { userId } });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "이미 존재하는 아이디입니다." });
    }

    return res
      .status(200)
      .json({ success: true, message: "사용 가능한 아이디입니다." });
  } catch (error) {
    console.error("Error during ID check:", error);
    return res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};

//로그인
/* POST /users/userLogin */
exports.userLogin = async (req, res) => {
  const { userId, userPw, autoLogin } = req.body;
  console.log(userId, userPw, autoLogin);

  try {
    // 데이터베이스에서 사용자 조회
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.send({
        success: false,
        message: "존재하지 않는 사용자 ID입니다.",
      });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(userPw, user.userPw);
    if (!isMatch) {
      return res.send({
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    // JWT 토큰 생성
    const expiresIn = autoLogin ? "7d" : "1h"; // 자동 로그인 체크 시 7일, 아니면 1시간
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn, // 토큰 만료 시간
    });

    // 응답으로 토큰 반환
    return res.status(200).json({
      message: "로그인 성공",
      success: true,
      token,
    });
  } catch (error) {
    console.error("Login Error: ", error.message);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

//회원정보 수정
exports.updateUserInfo = async (req, res) => {
  try {
    const { userId, newUserPw, newName, newBirthdate } = req.body;

    // 필수 항목 체크
    if (!userId || (!newUserPw && !newName && !newBirthdate)) {
      return res.status(400).json({ message: "수정할 항목을 입력해주세요." });
    }

    // 사용자 조회
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 비밀번호가 제공되었으면 암호화
    let updatedData = {};
    if (newUserPw) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newUserPw, saltRounds);
      updatedData.user_pw = hashedPassword;
    }

    // 다른 필드 업데이트
    if (newName) updatedData.name = newName;
    if (newBirthdate) updatedData.birthdate = newBirthdate;

    // 사용자 정보 업데이트
    await User.update(updatedData, { where: { userId } });

    res
      .status(200)
      .json({ message: "사용자 정보가 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("Error during user info update:", error);
    res.status(500).json({ message: "서버 오류", error: error.message });
  }
};

/**회원 탈퇴 **/
exports.deleteUser = async (req, res) => {
  try {
    // 로컬스토리지에 저장된 토큰 프론트엔드에서 요청 헤더에 담아 전송해야 함
    const token = req.headers.authorization?.split(" ")[1]; // Bearer Token 형식
    if (!token) {
      return res.status(401).send("토큰이 필요합니다.");
    }

    const decoded = jwt.verify(token, SECRET_KEY); // 토큰 검증
    const userId = decoded.userId; // 페이로드에서 사용자 ID 가져오기

    // User 테이블에서 현재 로그인된 사용자의 데이터 삭제
    const deleted = await User.destroy({
      where: { id: userId },
    });

    if (!deleted) {
      return res.status(404).send("사용자 정보를 찾을 수 없습니다.");
    }

    // 삭제 성공 응답
    res
      .status(200)
      .json({ success: true, message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("서버 오류 발생");
  }
};
