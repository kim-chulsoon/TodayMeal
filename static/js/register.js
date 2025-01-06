document.addEventListener("DOMContentLoaded", () => {
  const pw1 = document.getElementById("userPw1");
  const pw2 = document.getElementById("userPw2");
  const check1 = document.querySelector(".check1");
  const check2 = document.querySelector(".check2");

  // 비밀번호 유효성 검사
  const regPw =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$])[A-Za-z\d!@#$]{5,15}$/;

  // 비밀번호 유효성 검사 및 확인
  function valiPw() {
    const pwP = document.querySelector(".pwP");
    const isPw1Vali = regPw.test(pw1.value);
    const isPwMatch = pw1.value === pw2.value && pw1.value !== "";

    // userpw1의 유효성 검사 결과에 따라 체크
    if (isPw1Vali) {
      check1.style.display = "block";
      pwP.innerText = "영문 소/대문자, 숫자, !@#$ 포함 5 ~ 15자";
      pwP.style.color = "rgba(160, 160, 160, 1)";
    } else {
      check1.style.display = "none";
      pwP.innerText =
        "비밀번호는 영문 소/대문자, 숫자, !@#$ 포함 5 ~ 15자여야 합니다.";
      pwP.style.color = "red";
    }

    // userPw1과 userPw2 확인
    if (isPw1Vali && isPwMatch) {
      check2.style.display = "block";
    } else {
      check2.style.display = "none";
    }
  }
  // 패스워드 입력 필드 이벤트 변화 감지
  pw1.addEventListener("input", valiPw);
  pw2.addEventListener("input", valiPw);
});
