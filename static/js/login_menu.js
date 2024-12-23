document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const gnb = document.getElementById("gnb");
  const f_menu = document.getElementById("f_menu");

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

function logout() {
  localStorage.removeItem("authToken");
  document.location.href = "/";
  console.log("로그아웃 성공");
}
