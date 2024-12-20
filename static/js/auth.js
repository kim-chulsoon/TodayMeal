document.addEventListener("DOMContentLoaded", () => {
  // 재료 메모장 폼 제출 처리
  const ingredientsForm = document.getElementById("ingrForm"); // 'ingredientsForm' → 'ingrForm'
  if (ingredientsForm) {
    ingredientsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await submitMemoForm(ingredientsForm, "ingredients");
    });
  }

  // 레시피 메모장 폼 제출 처리
  const recipeForm = document.getElementById("rcprForm"); // 'recipeForm' → 'rcprForm'
  if (recipeForm) {
    recipeForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await submitMemoForm(recipeForm, "recipe");
    });
  }
});

// 토큰 가져오기 함수
function getAuthToken() {
  return localStorage.getItem("authToken"); // 'authtoken' → 'authToken'으로 수정
}

// 폼 제출 처리 함수
async function submitMemoForm(form, type) {
  const authtoken = getAuthToken();
  console.log("authtoken:", authtoken); // 디버깅용 로그

  if (!authtoken) {
    alert("로그인이 필요합니다.");
    window.location.href = "/users/login";
    return;
  }

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await axios.post("/detail/notes", payload, {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201 || response.status === 200) {
      // 201도 포함
      alert(
        `${type === "ingredients" ? "재료" : "레시피"} 메모가 저장되었습니다.`,
      );
      window.location.reload();
    } else {
      alert(
        `${
          type === "ingredients" ? "재료" : "레시피"
        } 메모 저장에 실패했습니다.`,
      );
    }
  } catch (error) {
    console.error(
      `${type === "ingredients" ? "재료" : "레시피"} 메모 저장 오류:`,
      error,
    );
    alert(
      `${
        type === "ingredients" ? "재료" : "레시피"
      } 메모 저장 중 오류가 발생했습니다.`,
    );
  }
}
