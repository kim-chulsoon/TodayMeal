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
    // 로그인폼 변환
    loginOn.forEach((item) => {
      item.style.display = "block";
    });
    loginOff.forEach((item) => {
      item.style.display = "none";
    });
  } else {
    // 로그인을 안했을 때
    // 로그인폼 변환
    loginOn.forEach((item) => {
      item.style.display = "none";
    });
    loginOff.forEach((item) => {
      item.style.display = "block";
    });

    // 쿠키가 존재하는지 체크하고 없으면 10분간 유지되는 쿠키를 생성하고 팝업을 띄움
    if (!getCookie("popupCookie")) {
      let date = new Date(); // 현재 시간 생성
      date.setMinutes(date.getMinutes() + 10); // 현재 시간에 10분 추가
      document.cookie =
        "popupCookie" +
        "=" +
        "true" +
        ";expires=" +
        date.toUTCString() +
        ";path=/";
      // 팝업 띄우기
      loginPopup();
    }
  }
}

function loginPopup() {
  //로그인 모달
  const em = document.querySelector(".roundPopup");
  em.style.bottom = "80px";
  setTimeout(() => {
    em.style.bottom = "-60px";
  }, 5000);
}

function getCookie(cookieName) {
  let cookies = document.cookie.split(";"); // 쿠키를 세미콜론(;) 기준으로 분리
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim(); // 앞뒤 공백 제거
    // 쿠키 이름과 값 분리
    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1); // 값만 반환
    }
  }
  return null; // 해당 쿠키가 없으면 null 반환
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
