const models = require("../models/index");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models"); // User 모델 가져오기
const upload = require("../app");

// JWT 시크릿 키
const SECRET_KEY = process.env.SECRET_KEY;

/* GET /users */
exports.users = async (req, res) => {
  try {
    const user = req.user || null; // 인증된 사용자 정보 가져오기

    // 인증되지 않은 사용자 처리
    if (!user) {
      return res.render("users", { user: [] });
    }

    const userId = user.id;
    console.log("유저userid", userId);

    // User 테이블에서 사용자 정보 조회
    const userData = await User.findOne({
      where: { id: userId },
      attributes: ["id", "userId", "name", "profileImage", "birthdate"], // 반환할 필드 지정
    });

    if (!userData) {
      // 사용자가 데이터베이스에 존재하지 않는 경우
      return res
        .status(404)
        .json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
    }

    // 사용자 정보 반환
    res.render("users", {
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("사용자 정보 조회 중 오류:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

/* GET /users/login */
exports.login = (req, res) => {
  res.render("login");
};

/* GET /users/edit */
exports.edit = async (req, res) => {
  try {
    const user = req.user || null; // 인증된 사용자 정보 가져오기

    // 인증되지 않은 사용자 처리
    if (!user) {
      return res.render("usersedit", { user: [] });
    }

    const userId = user.id;
    console.log("userid", userId);

    // User 테이블에서 사용자 정보 조회
    const userData = await User.findOne({
      where: { id: userId },
      attributes: ["id", "userId", "name", "profileImage", "birthdate"], // 반환할 필드 지정
    });

    if (!userData) {
      // 사용자가 데이터베이스에 존재하지 않는 경우
      return res
        .status(404)
        .json({ success: false, message: "사용자 정보를 찾을 수 없습니다." });
    }

    console.log("userdata", userData);
    // 사용자 정보 반환
    res.render("usersedit", {
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("사용자 정보 조회 중 오류:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

/* GET /users/register */
exports.register = (req, res) => {
  res.render("register");
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
      return res.status(200).json({ message: "이미 존재하는 아이디입니다." });
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
    console.log("아이디:", userId);

    if (!userId) {
      return res.status(400).json({ message: "아이디를 입력해주세요." });
    }

    const existingUser = await User.findOne({ where: { userId } });

    if (existingUser) {
      return res
        .status(200)
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

// 로그인
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
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn });

    // 쿠키 옵션 설정
    const cookieOptions = {
      httpOnly: false, // 클라이언트에서 JavaScript로 쿠키에 접근 불가
      secure: false,
      maxAge: autoLogin ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 유효 기간 (ms)
    };

    // 쿠키에 JWT 저장
    res.cookie("authToken", token, cookieOptions);

    // 응답 메시지 반환
    return res.status(200).json({
      message: "로그인 성공",
      success: true,
    });
  } catch (error) {
    console.error("Login Error: ", error.message);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

//회원정보 수정
exports.updateUserInfo = async (req, res) => {
  try {
    const { userId, newUserPw, newName, newBirthdate, profileImage } = req.body;

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
    console.log("프로필이미지:", profileImage);
    // 다른 필드 업데이트
    if (newName) updatedData.name = newName;
    if (newBirthdate) updatedData.birthdate = newBirthdate;
    if (profileImage) updatedData.profileImage = profileImage;

    // 사용자 정보 업데이트
    await User.update(updatedData, { where: { userId } });

    res.status(200).json({
      success: true,
      message: "사용자 정보가 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.error("Error during user info update:", error);
    res.status(500).json({ message: "서버 오류", error: error.message });
  }
};

/**회원 탈퇴 **/
exports.deleteUser = async (req, res) => {
  const userId = req.user.id;
  console.log("탈퇴유저아디:", userId);

  // User 테이블에서 현재 로그인된 사용자의 데이터 삭제
  const deleted = await User.destroy({
    where: { id: userId },
  });

  if (!deleted) {
    return res.status(404).send("사용자 정보를 찾을 수 없습니다.");
  }

  // 쿠키 삭제: 쿠키의 만료일을 과거로 설정
  res.clearCookie("authToken", { httpOnly: true, secure: true });

  // 삭제 성공 응답
  res
    .status(200)
    .json({ success: true, message: "회원 탈퇴가 완료되었습니다." });
};

//파일 업로드
exports.dynamicUpload = async (req, res) => {
  try {
    console.log("Uploaded file info:", req.file);
    console.log("Additional fields:", req.body);

    // 업데이트 성공 시 해당 경로를 응답
    res.send(req.file.path);
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send("파일 업로드에 실패했습니다.");
  }
};

// /users/logout
//로그아웃
exports.logout = (req, res) => {
  try {
    // 쿠키 삭제: 동일한 쿠키 이름(authToken)과 경로, 옵션 설정
    res.cookie("authToken", "", {
      httpOnly: false, // 동일하게 설정
      secure: false, // 동일하게 설정
      maxAge: 0, // 만료 시간 0으로 설정
    });

    return res.status(200).json({
      success: true,
      message: "로그아웃되었습니다.",
    });
  } catch (error) {
    console.error("로그아웃 처리 중 오류:", error.message);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};
