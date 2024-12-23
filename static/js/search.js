const form = document.forms["search"];

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
