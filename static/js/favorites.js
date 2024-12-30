document.addEventListener("DOMContentLoaded", () => {
  // 로그인체크
  checkLoginStatus(document.cookie.includes("authToken="));
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

// document.addEventListener("DOMContentLoaded", () => {
//   const container = document.querySelector(".container"); // 데이터를 추가할 컨테이너
//   const authToken = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰 가져오기

//   // 서버로 요청 보내기
//   axios
//     .get("/favorites", {
//       headers: { Authorization: `Bearer ${authToken}` },
//     })
//     .then((response) => {
//       const favoriteVideos = response.data.favoriteVideos;

//       if (!favoriteVideos || favoriteVideos.length === 0) {
//         container.innerHTML = `<p>즐겨찾기한 동영상이 없습니다. 동영상을 추가해보세요!</p>`;
//         return;
//       }

//       // 데이터를 HTML로 동적으로 생성
//       favoriteVideos.forEach((favorite) => {
//         const itemHTML = `
//                 <div class="item">
//                   <a href="/detail?videoId=${favorite.Video.youtubeUrl}" target="_blank">
//                     <div class="thumbnail">
//                       <img src="${favorite.Video.thumbnailUrl}" alt="${favorite.Video.title} 썸네일" />
//                     </div>
//                     <div class="description">
//                       <h3 class="title">${favorite.Video.title}</h3>
//                       <p class="creator">채널: ${favorite.Video.channelTitle}</p>
//                       <p class="subtitle">${favorite.Video.description}</p>
//                     </div>
//                   </a>
//                 </div>
//               `;
//         container.innerHTML += itemHTML; // 컨테이너에 추가
//       });
//     })
//     .catch((error) => {
//       console.error(
//         "데이터 로드 실패:",
//         error.response ? error.response.data : error.message,
//       );
//       alert("데이터를 가져오는 중 오류가 발생했습니다.");
//     });
// });
