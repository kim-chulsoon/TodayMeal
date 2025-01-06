document.addEventListener("DOMContentLoaded", () => {
  // 로그인체크
  checkLoginStatus(document.cookie.includes("authToken="));
});

// 접속시 로그인 여부 체크처리
function checkLoginStatus(status) {
  const loginOn = document.querySelectorAll(".login-On");
  const loginOff = document.querySelectorAll(".login-Off");

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
