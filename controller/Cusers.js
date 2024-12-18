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

//회원가입
exports.userRegister = async (req, res) => {
  try {
    const { userId, userPw, name, birthdate } = req.body; // 요청 데이터 구조에 맞게 수정

    // 필수 항목 체크
    if (!userId || !userPw || !name || !birthdate) {
      return res
        .status(400)
        .json({ message: "모든 필수 항목을 입력해주세요." });
    }

    // 아이디 중복 체크
    const existingUser = await User.findOne({ where: { user_id: userId } });
    if (existingUser) {
      return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPw, saltRounds);

    // 사용자 생성
    const newUser = await User.create({
      user_id: userId,
      user_pw: hashedPassword,
      name,
      birthdate,
    });

    res
      .status(201)
      .json({ message: "회원가입 성공!", userId: newUser.user_id });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "서버 오류", error: error.message });
  }
};

//로그인
/* POST /users/userLogin */
exports.userLogin = async (req, res) => {
  const { userId, userPw, autoLogin } = req.body;
  console.log(userId, userPw, autoLogin);

  try {
    // 데이터베이스에서 사용자 조회
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.send({
        success: false,
        message: "존재하지 않는 사용자 ID입니다.",
      });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(userPw, user.user_pw);
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
    const user = await User.findOne({ where: { user_id: userId } });
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
    await User.update(updatedData, { where: { user_id: userId } });

    res
      .status(200)
      .json({ message: "사용자 정보가 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("Error during user info update:", error);
    res.status(500).json({ message: "서버 오류", error: error.message });
  }
};
