const form = document.forms["search"];

// 엔터입력
function search_enter(event) {
  // 특정 키를 처리하는 예제
  if (event.target.value && event.keyCode === 13) {
    searching(form.search.value);
  }
}

// 클릭
function search_click() {
  searching(form.search.value);
}

// SQL 인젝션 방지 취약 특수문자 제거
function searching(e) {
  // SQL 인젝션을 방지하기 위한 사용자 입력값 정제
  const inputData = e; // 사용자 입력
  const sanitizedData = inputData.replace(/['";#--]/g, "");

  // 비동기 요청
  axios({
    method: "get",
    url: "/search/video",
    params: { content: sanitizedData },
  })
    .then((res) => {})
    .catch((err) => {
      alert(err.data.message);
    });
}
