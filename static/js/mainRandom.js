document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.forms["search"];
  const recDishs = document.querySelectorAll("header .recDish > button");

  //페이지 접속시 추천음식 정렬
  readFoodData();

  // 추천메뉴 클릭 시 해당 음식이름을 가져오도록
  recDishs.forEach((recDish) => {
    recDish.addEventListener("click", () => {
      searchForm.keyword.value = recDish.textContent;
    });
  });
});

// 엑셀파일의 추천할 요리 이름을 가져옴
function readFoodData() {
  const recDish = document.querySelectorAll("header .recDish > button");

  fetch("static/util/food_data.xlsx")
    .then((response) => response.arrayBuffer())
    .then((data) => {
      const workbook = XLSX.read(new Uint8Array(data), { type: "array" });

      // 첫 번째 시트만 읽어오기
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // 시트를 JSON으로 변환
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        header: ["name"], // 키 이름 별도 지정
      });

      // 태그를 순환하면서 랜덤으로 음식의 이름을 추가함
      recDish.forEach((item) => {
        item.textContent = jsonData[Math.floor(Math.random() * 101)].name;
      });
    })
    .catch((error) => console.error("파일로드 실패:", error));
}
