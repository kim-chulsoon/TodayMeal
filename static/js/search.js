const form = document.forms["search"];
const searchForm = document.forms["keyword"];

document.addEventListener("DOMContentLoaded", () => {
  // 로그인체크
  checkLoginStatus(document.cookie.includes("authToken="));
  // 검색한값 Search창에서 유지
  searchKeyword();
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

function searchKeyword() {
  // URL 쿼리값 가져오기
  const queryString = window.location.search;
  // 쿼리값을 파싱함
  const urlParams = new URLSearchParams(queryString);
  searchForm.keyword.value = urlParams.get("keyword");
}

// 엔터입력
function search_enter(event) {
  // 특정 키를 처리하는 예제
  if (event.target.value && event.keyCode === 13) {
    searching(form.keyword.value);
  }
}

// 클릭
function search_click() {
  searching(form.keyword.value);
}

// SQL 인젝션 방지 취약 특수문자 제거
function searching(e) {
  // SQL 인젝션을 방지하기 위한 사용자 입력값 정제
  const inputData = e; // 사용자 입력
  const sanitizedData = inputData.replace(/['";#--]/g, "");
  form["keyword"].value = sanitizedData;
  form.submit();
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
