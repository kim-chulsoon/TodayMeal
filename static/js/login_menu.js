document.addEventListener("DOMContentLoaded", () => {
  const token = document.cookie.includes("authToken=");
  const gnb = document.getElementById("gnb");
  const f_menu = document.getElementById("f_menu");

  console.log("토큰", token);
  if (token) {
    // 로그인 상태
    gnb.innerHTML = `
        <a href="/users">내정보</a>
        <a href="#" onclick="logout()">로그아웃</a>
      `;

    f_menu.innerHTML = `  <a href="/users"
        ><img src="../../static/img/icons/Profile.png" alt="프로필"
      /></a>`;
  } else {
    // 로그아웃 상태
    gnb.innerHTML = `
        <a href="/users/login">로그인</a>
        <a href="/users/register">회원가입</a>
      `;

    f_menu.innerHTML = ` <a href="/users/login"
        ><img src="../../static/img/icons/Login.png" alt="로그인"
      /></a>`;
  }
});

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
