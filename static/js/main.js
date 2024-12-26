document.addEventListener("DOMContentLoaded", () => {
  // 로그인체크
  checkLoginStatus(document.cookie.includes("authToken="));
});

// 접속시 로그인 여부 체크처리
function checkLoginStatus(status) {
  const loginOn = document.querySelectorAll(".login-On");
  const loginOff = document.querySelectorAll(".login-Off");
  console.log(loginOn);
  if (status) {
    // 로그인을 했을 때
    loginOn.forEach((item) => {
      item.style.display = "block";
    });
    loginOff.forEach((item) => {
      item.style.display = "none";
    });
  } else {
    loginOn.forEach((item) => {
      item.style.display = "none";
    });
    loginOff.forEach((item) => {
      item.style.display = "block";
    });
  }
}

async function logout() {
  try {
    // 로그아웃 요청 전송
    const response = await axios.post(
      "/users/logout",
      {},
      { withCredentials: true },
    );

    if (response.status === 200) {
      alert("로그아웃되었습니다.");
      document.location.href = "/"; // 홈으로 리디렉션
    } else {
      alert("로그아웃에 실패했습니다.");
    }
  } catch (error) {
    console.error("로그아웃 오류:", error);
    alert("서버 오류가 발생했습니다.");
  }
}
