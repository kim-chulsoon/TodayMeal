const more = document.querySelector(".moreLine");
const form = document.forms["bookmark"];

// 에디터 전역화
let ingEditor;
let rcpEditor;

// 로그인 검증을 위한 토큰값 불러오기
document.addEventListener("DOMContentLoaded", () => {
  // 모바일 타이틀 재지정
  document.querySelector(".headMenu h3").textContent = "상세보기";

  loginCheak(document.cookie.includes("authToken="));
  checkLoginStatus(document.cookie.includes("authToken="));

  // HTML 태그 사용을 위한 코드 변환
  const testaDiv = document.querySelector(".ingredientContent");
  const decodedHTML = testaDiv.textContent; // 엔티티를 디코딩
  testaDiv.innerHTML = decodedHTML; // 디코딩된 값을 innerHTML로 설정

  const testaDiv2 = document.querySelector(".RecipeContent");
  const decodedHTML2 = testaDiv2.textContent; // 엔티티를 디코딩
  testaDiv2.innerHTML = decodedHTML2; // 디코딩된 값을 innerHTML로 설정
});

// 영상 설명 더보기/숨기기
more.addEventListener("click", () => {
  const subtitle = document.querySelector(".subtitle");
  const moreText = more.querySelector("p");

  // 크기를 초과했을때만 작동하도록
  if (subtitle.clientHeight >= 110) {
    // 설명 더보기 버튼
    if (subtitle.classList.contains("subtitle-off")) {
      // 숨김
      subtitle.classList.remove("subtitle-off");
      subtitle.classList.add("subtitle-on");
      moreText.innerText = "간단히";
    } else {
      // 늘림
      subtitle.classList.remove("subtitle-on");
      subtitle.classList.add("subtitle-off");
      moreText.innerText = "더보기";
    }
  }
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

// 전체 메모 삭제
function delAllMemo() {
  // videoId 가져오기
  const videoId = document.getElementById("videoId").value;

  // 확인창
  const confirmDelete = confirm("정말로 모든 메모를 삭제하시겠습니까?");
  if (!confirmDelete) return;

  axios
    .post(
      "detail/notes/delete",
      { videoId }, // 요청 본문
      {
        withCredentials: true, // 쿠키를 전송할 수 있도록 설정
      },
    )
    .then((response) => {
      if (response.data.success) {
        alert("모든 메모가 삭제되었습니다.");
        // 페이지 새로고침
        window.location.reload();
      } else {
        alert("메모 삭제 중 오류가 발생했습니다.");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("메모 삭제 중 오류가 발생했습니다.");
    });
}

// 메모 보이기 안보이기
function loginCheak(token) {
  const loginAlert = document.querySelector("main > .memoBox > .loginAlert");
  const form = document.querySelectorAll("main > .memoBox .memoItem");
  if (token) {
    // 로그인 했을때
    if (loginAlert.classList.contains("loginAlert-On")) {
      // 블러와 알림을 없앤다
      loginAlert.classList.remove("loginAlert-On");
      loginAlert.classList.add("loginAlert-Off");
      form[0].classList.remove("blur");
      form[1].classList.remove("blur");
    }
  } else {
    if (loginAlert.classList.contains("loginAlert-Off")) {
      // 숨김
      loginAlert.classList.add("loginAlert-On");
      loginAlert.classList.remove("loginAlert-Off");
      form[0].classList.add("blur");
      form[1].classList.add("blur");
    }
  }
}

// 페이지 로드 시 초기 북마크 상태 설정
async function initializeBookmark() {
  const btnIocn = document.querySelector("#bookmarkBtn i");
  const btn = document.querySelector("#bookmarkBtn");
  const videoId = document.getElementById("videoId").value;

  try {
    // 즐겨찾기 상태 확인 API 호출
    const response = await axios.get(`/favorites/status`, {
      params: { videoId }, // GET 요청의 파라미터
      withCredentials: true,
    });

    const { isBookmarked, userId } = response.data; // 서버 응답 데이터에서 isBookmarked와 userId 추출

    if (!userId) {
      console.log("로그인하지 않은 상태입니다. 북마크 초기화를 건너뜁니다.");
      return; // userId가 없으면 초기화 중단
    }

    if (isBookmarked) {
      // 북마크 상태일 경우
      btn.setAttribute("data-status", true); // 북마크 활성화
      btn.classList.add("bookmarkButton-on");
      btn.classList.remove("bookmarkButton-off");
      btnIocn.classList.add("fa-solid");
      btnIocn.classList.remove("fa-regular");
    } else {
      // 북마크 상태가 아닐 경우
      btn.setAttribute("data-status", false); // 북마크 비활성화
      btn.classList.add("bookmarkButton-off");
      btn.classList.remove("bookmarkButton-on");
      btnIocn.classList.add("fa-regular");
      btnIocn.classList.remove("fa-solid");
    }
  } catch (error) {
    console.error("북마크 초기화 중 오류 발생:", error.response?.data || error);
  }
}

// 북마크 토글 애니메이션 및 상태 설정
async function toggleBookmark() {
  const btnIocn = document.querySelector("#bookmarkBtn i");
  const btn = document.querySelector("#bookmarkBtn");

  try {
    if (btn.classList.contains("bookmarkButton-off")) {
      const videoId = document.getElementById("videoId").value;
      // 북마크를 안 했을 때
      btn.setAttribute("data-status", true); // 북마크 활성화
      btnIocn.classList.remove("fa-regular");
      btn.classList.add("bookmarkButton-on");
      btn.classList.remove("bookmarkButton-off");
      btnIocn.classList.add("fa-solid");

      // 북마크 추가 요청
      const response = await axios.post(
        "/favorites/save",
        { videoId }, // 요청 본문 데이터
        {
          withCredentials: true, // 쿠키를 포함하여 요청
        },
      );

      if (response.status === 201) {
        alert("북마크가 성공적으로 저장되었습니다!");
      } else {
        throw new Error("북마크 저장 실패");
      }
    } else {
      // 북마크를 한 상태일 때
      const videoId = document.getElementById("videoId").value;
      btn.setAttribute("data-status", false); // 북마크 비활성화
      btn.classList.remove("bookmarkButton-on");
      btnIocn.classList.remove("fa-solid");
      btn.classList.add("bookmarkButton-off");
      btnIocn.classList.add("fa-regular");

      // 북마크 삭제 요청
      const response = await axios.delete("/favorites/delete", {
        data: { videoId }, // DELETE 요청의 데이터는 `data` 속성에 넣어야 함
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("북마크가 성공적으로 삭제되었습니다!");
      } else {
        throw new Error("북마크 삭제 실패");
      }
    }
  } catch (error) {
    console.error("북마크 처리 중 오류 발생:", error.response?.data || error);
    alert("메모를 저장해주세요!");
    // 오류 발생 시 버튼 상태 복구
    if (btn.getAttribute("data-status") === "true") {
      btn.setAttribute("data-status", false);
      btn.classList.remove("bookmarkButton-on");
      btnIocn.classList.remove("fa-solid");
      btn.classList.add("bookmarkButton-off");
      btnIocn.classList.add("fa-regular");
    } else {
      btn.setAttribute("data-status", true);
      btn.classList.remove("bookmarkButton-off");
      btnIocn.classList.remove("fa-regular");
      btn.classList.add("bookmarkButton-on");
      btnIocn.classList.add("fa-solid");
    }
  }
}

// 페이지 로드 시 초기화 실행
window.onload = initializeBookmark;

// 재료메모 폼 변환
function ingForm() {
  const ingform = document.querySelectorAll(".memoItem.ing form");

  if (ingform[0].classList.contains("ingForm-Open")) {
    ingform[0].classList.remove("ingForm-Open");
    ingform[0].classList.add("ingForm");
    ingform[1].classList.remove("ingForm");
    ingform[1].classList.add("ingForm-Open");
  } else {
    ingform[0].classList.add("ingForm-Open");
    ingform[0].classList.remove("ingForm");
    ingform[1].classList.add("ingForm");
    ingform[1].classList.remove("ingForm-Open");
  }
}

// 레시피 메모 폼 변환
function rcpForm() {
  const rcpform = document.querySelectorAll(".memoItem.rcp form");

  if (rcpform[0].classList.contains("rcpForm-Open")) {
    rcpform[0].classList.remove("rcpForm-Open");
    rcpform[0].classList.add("rcpForm");
    rcpform[1].classList.remove("rcpForm");
    rcpform[1].classList.add("rcpForm-Open");
  } else {
    rcpform[0].classList.add("rcpForm-Open");
    rcpform[0].classList.remove("rcpForm");
    rcpform[1].classList.add("rcpForm");
    rcpform[1].classList.remove("rcpForm-Open");
  }
}

// 토큰 가져오기 함수
function getAuthToken() {
  return localStorage.getItem("authToken");
}

// 노트 데이터 가져오기
async function fetchCurrentNote(videoId) {
  let currentNote;
  try {
    const response = await axios.get(`/detail`, {
      params: { videoId },
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (response.data.success) {
      currentNote = response.data.note;
    } else {
      currentNote = null;
    }
  } catch (error) {
    console.error("노트 조회 오류:", error);
    currentNote = null;
  }
}

// 에디터 초기화 및 데이터 채우기
document.addEventListener("DOMContentLoaded", () => {
  initializeEditors();
});

// 에디터 초기화 함수
function initializeEditors() {
  const {
    ClassicEditor,
    Alignment,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    Code,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    FullPage,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Paragraph,
    ShowBlocks,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
  } = window.CKEDITOR;

  const LICENSE_KEY =
    "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjYyNzUxOTksImp0aSI6IjIwMjBhMDJkLWQ0MWQtNGRiMS05MmQzLTkxMjg1NWVmYjc4ZiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCJdLCJ2YyI6IjkyYjAyYjc4In0.3JMMpSOpGBDPeDgKM2ongwDdBCfEqNZARRITKn9KFtfMuo0zN9RnVR9gp4_9L6GEaIAEIOaXz2jpU6Aucfv-wQ"; // 실제 라이선스 키로 교체하세요

  const ingDataConfig = {
    toolbar: {
      items: [
        "sourceEditing",
        "showBlocks",
        "findAndReplace",
        "|",
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "code",
        "|",
        "specialCharacters",
        "horizontalLine",
        "link",
        "insertImageViaUrl",
        "insertTable",
        "highlight",
        "blockQuote",
        "htmlEmbed",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Alignment,
      AutoImage,
      Autosave,
      BlockQuote,
      Bold,
      Code,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FullPage,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlComment,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Paragraph,
      ShowBlocks,
      SourceEditing,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "|",
        "resizeImage",
      ],
    },
    initialData:
      "<h1>🥬🌽재료를 입력해보세요!</h1><h3>HTML 마크업, 이미지, 리스트 등 다양한 문서 속성을 지원합니다!</h3>",
    language: "ko",
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
  };

  const rcpDataConfig = {
    toolbar: {
      items: [
        "sourceEditing",
        "showBlocks",
        "findAndReplace",
        "|",
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "code",
        "|",
        "specialCharacters",
        "horizontalLine",
        "link",
        "insertImageViaUrl",
        "insertTable",
        "highlight",
        "blockQuote",
        "htmlEmbed",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Alignment,
      AutoImage,
      Autosave,
      BlockQuote,
      Bold,
      Code,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FullPage,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlComment,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Paragraph,
      ShowBlocks,
      SourceEditing,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "|",
        "resizeImage",
      ],
    },
    initialData:
      "<h1>🍎🍒🔥레시피를 입력해보세요!</h1><h3>HTML 마크업, 이미지, 리스트 등 다양한 문서 속성을 지원합니다!</h3>",
    language: "ko",
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
  };

  // 재료 에디터 초기화
  ClassicEditor.create(document.querySelector("#ingData"), ingDataConfig)
    .then((editor) => {
      ingEditor = editor;
      // 재료 저장 버튼에 *별도의* 이벤트 리스너 추가
      const ingSaveBtn = document.querySelector(".memoItem.ing .registr");
      if (ingSaveBtn) {
        ingSaveBtn.addEventListener("click", async () => {
          const editorData = ingEditor.getData();
          await saveOrUpdateMemo(editorData, "ingredients");
        });
      } else {
        console.error(
          "재료 저장 버튼(.memoItem.ing .registr)을 찾을 수 없습니다.",
        );
      }
    })
    .catch((error) => {
      console.error("CKEditor 초기화 오류 (재료):", error);
    });

  // 레시피 에디터 초기화
  ClassicEditor.create(document.querySelector("#rcpData"), rcpDataConfig)
    .then((editor) => {
      rcpEditor = editor;

      // 레시피 저장 버튼에 *별도의* 이벤트 리스너 추가
      const rcpSaveBtn = document.querySelector(".memoItem.rcp .registr");
      if (rcpSaveBtn) {
        rcpSaveBtn.addEventListener("click", async () => {
          const editorData = rcpEditor.getData();
          await saveOrUpdateMemo(editorData, "recipe");
        });
      } else {
        console.error(
          "레시피 저장 버튼(.memoItem.rcp .registr)을 찾을 수 없습니다.",
        );
      }
    })
    .catch((error) => {
      console.error("CKEditor 초기화 오류 (레시피):", error);
    });
}

// 에디터에 데이터 채우기 함수
function populateEditors(note) {
  if (note) {
    if (note.ingredients) {
      ingEditor.setData(note.ingredients);
    }
    if (note.recipe) {
      rcpEditor.setData(note.recipe);
    }
  }
}

// 메모 생성 또는 수정 함수 (디버그 로그 추가 버전)
async function saveOrUpdateMemo(data, noteType) {
  const videoId = document.getElementById("videoId").value;
  const title = document.getElementById("title").value;
  const channelTitle = document.getElementById("channelTitle").value;
  const thumbnailUrl = document.getElementById("thumbnailUrl").value;

  try {
    const payload = {
      [noteType]: data,
      videoId,
      title,
      channelTitle,
      thumbnailUrl,
    };

    const response = await axios.post("/detail/notes", payload, {
      withCredentials: true,
    });

    if (response.data.success) {

      alert(response.data.message || "메모가 저장되었습니다.");

      const updatedNote = response.data.note;


      // noteIdContainer 업데이트
      const noteIdContainer = document.getElementById("noteIdContainer");
      if (noteIdContainer) {
        noteIdContainer.dataset.noteId = updatedNote.id;
        console.log(
          "[DEBUG] noteIdContainer 업데이트 완료:",
          noteIdContainer.dataset.noteId,
        );
      } else {
        console.error(
          "noteIdContainer가 존재하지 않습니다. HTML을 확인하세요.",
        );
      }

      // 폼 전환 후 DOM 조작을 위한 Promise 기반 함수
      const updateReadonlyArea = (selector, noteContent, defaultMessage) => {
        return new Promise((resolve) => {
          // requestAnimationFrame을 사용하여 렌더링 완료 후 실행 보장
          requestAnimationFrame(() => {
            const readOnlyArea = document.querySelector(selector);
            if (readOnlyArea) {
              readOnlyArea.value = noteContent || defaultMessage;
              resolve(); // 성공적으로 업데이트 완료 시 resolve 호출
            } else {
              console.error(
                defaultMessage.split("입력")[0] +
                  " textarea를 찾을 수 없습니다!",
              ); // 에러 메시지 개선
              resolve(); // 엘리먼트를 찾지 못해도 resolve 호출하여 다음 코드 진행
            }
          });
        });
      };

      if (noteType === "ingredients") {
        ingForm(); // 폼 전환

        const ingredientContent = document.querySelector(".ingredientContent");
        if (ingredientContent) {
          ingredientContent.innerHTML =
            updatedNote.ingredients || "🫑재료를 입력해보세요!"; // HTML 형식으로 업데이트
          console.log("[DEBUG] ingredientContent 업데이트 완료");
        } else {
          console.error(
            "ingredientContent 요소를 찾을 수 없습니다. HTML을 확인하세요.",
          );
        }
      } else if (noteType === "recipe") {
        rcpForm(); // 폼 전환

        const RecipeContent = document.querySelector(".RecipeContent");
        if (RecipeContent) {
          RecipeContent.innerHTML =
            updatedNote.recipe || "🪄레시피를 입력해보세요!‍"; // HTML 형식으로 업데이트
          console.log("[DEBUG] RecipeContent 업데이트 완료");
        } else {
          console.error(
            "RecipeContent 요소를 찾을 수 없습니다. HTML을 확인하세요.",
          );
        }
      }
    } else {
      // 중복 제거
      console.error(
        "[DEBUG] 응답은 성공(success)이 false입니다:",
        response.data,
      );
      alert(response.data.message || "메모가 저장되었습니다."); // 서버에서 메시지가 있으면 사용
    }
  } catch (error) {
    console.error("[DEBUG] 메모 저장/업데이트 오류 발생:", error);

    if (error.response) {
      console.error("[DEBUG] error.response.status:", error.response.status);
      console.error("[DEBUG] error.response.data:", error.response.data);
    } else {
      console.error("[DEBUG] error.message:", error.message);
    }

    alert("메모 저장/업데이트 중 오류가 발생했습니다.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let currentNote = null;
  try {
    const videoId = document.getElementById("videoId").value;
    if (videoId) {
      currentNote = await fetchCurrentNote(videoId);
      populateEditors(currentNote);
    }

    // 재료 저장 버튼 이벤트 리스너
    const ingSaveBtn = document.querySelector(".ing-registr");
    if (ingSaveBtn && !ingSaveBtn.eventListenerAdded) {
      ingSaveBtn.addEventListener("click", async () => {
        const editorData = ingEditor ? ingEditor.getData() : "";
        await saveOrUpdateMemo(editorData, "ingredients");
      });
      ingSaveBtn.eventListenerAdded = true;
    }

    // 레시피 저장 버튼 이벤트 리스너
    const rcpSaveBtn = document.querySelector(".rcp-registr");
    if (rcpSaveBtn && !rcpSaveBtn.eventListenerAdded) {
      rcpSaveBtn.addEventListener("click", async () => {
        const editorData = rcpEditor ? rcpEditor.getData() : "";
        await saveOrUpdateMemo(editorData, "recipe");
      });
      rcpSaveBtn.eventListenerAdded = true;
    }
  } catch (error) {
    // catch 블록 추가 및 위치 수정
    console.error("DOMContentLoaded 이벤트 리스너 오류:", error);
  }
});

// 재료 메모 저장 함수
async function saveIngredients(data) {
  await saveOrUpdateMemo(data, "ingredients");
}

// 레시피 메모 저장 함수
async function saveRecipe(data) {
  await saveOrUpdateMemo(data, "recipe");
}

// 메모창 초기화 버튼
function ingReset() {
  ingEditor.setData("");
}
function rcpReset() {
  rcpEditor.setData("");
}

// 재료 메모 삭제 함수
async function deleteIngredientsMemo() {
  const noteIdContainer = document.getElementById("noteIdContainer"); // noteIdContainer를 사용
  console.log("노트id", noteIdContainer);
  if (!noteIdContainer) {
    console.error("noteIdContainer 요소를 찾을 수 없습니다.");
    alert("내부 오류가 발생했습니다. 다시 시도해주세요.");
    return;
  }


  const noteId = noteIdContainer.dataset.noteId; // noteIdContainer에서 ID 가져오기

  if (!noteId) {
    alert("삭제할 메모가 없습니다.");
    return;
  }

  if (!confirm("재료 메모를 삭제하시겠습니까?")) {
    // document.querySelector(".ingredientContent").innerHTML = "";
    return;
  }

  try {
    const response = await axios.patch(`/detail/notes/${noteId}/ingredients`, {
      withCredentials: true,
    });

    if (response.data.success) {
      alert(response.data.message);
      // 재료 에디터 내용 초기화
      if (ingEditor) {
        ingEditor.setData("");
      } else {
        document.querySelector("#ingData").innerHTML = "";
      }

      // 재료 <textarea> 요소 다시 표시 및 내용 비우기
      const ingredientTextarea = document.querySelector(".ingredientContent");

      if (ingredientTextarea) {
        ingredientTextarea.style.display = "block"; // 또는 필요한 표시 방식으로 변경
        ingredientTextarea.textContent = ""; // 내용 비우기
      }
    } else {
      alert(response.data.message || "메모 삭제에 실패했습니다.");
    }
  } catch (error) {
    console.error("Axios 오류:", error); // 오류 전체 내용 출력
    alert("재료 메모 삭제 중 오류가 발생했습니다.");
  }
}
// 레시피 메모 삭제 함수
async function deleteRecipeMemo() {
  const noteIdContainer = document.getElementById("noteIdContainer"); // noteIdContainer를 사용
  console.log("노트id", noteIdContainer);
  if (!noteIdContainer) {
    console.error("noteIdContainer 요소를 찾을 수 없습니다.");
    alert("내부 오류가 발생했습니다. 다시 시도해주세요.");
    return;
  }

  const noteId = noteIdContainer.dataset.noteId; // noteIdContainer에서 ID 가져오기

  if (!noteId) {
    alert("삭제할 메모가 없습니다.");
    return;
  }
  if (!confirm("레시피 메모를 삭제하시겠습니까?")) {
    return;
  }

  try {
    const response = await axios.patch(`/detail/notes/${noteId}/recipe`, {
      withCredentials: true,
    });

    if (response.data.success) {
      alert(response.data.message);
      // 에디터 내용 초기화
      if (rcpEditor) {
        rcpEditor.setData("");
      } else {
        document.querySelector("#rcpData").innerHTML = "";
      }

      // 레시피 <textarea> 요소 다시 표시 및 내용 비우기
      const RecipeContent = document.querySelector(".RecipeContent");

      if (RecipeContent) {
        RecipeContent.style.display = "block"; // 또는 필요한 표시 방식으로 변경
        RecipeContent.textContent = ""; // 내용 비우기
      }
    } else {
      alert(response.data.message || "메모 삭제에 실패했습니다.");
    }
  } catch (error) {
    console.error("Axios 오류:", error); // 오류 전체 내용 출력
    alert("레시피 메모 삭제 중 오류가 발생했습니다.");
  }
}
