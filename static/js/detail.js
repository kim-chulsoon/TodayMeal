const more = document.querySelector(".moreLine");
const form = document.forms["bookmark"];

// 에디터 전역화
let ingEditor;
let rcpEditor;

// 로그인 검증을 위한 토큰값 불러오기
document.addEventListener("DOMContentLoaded", () => {
  loginCheak(document.cookie.includes("authToken="));
  checkLoginStatus(document.cookie.includes("authToken="));
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
    }
  }
}

// 북마크 토글 애니메이션 및 상태설정
async function toggleBookmark() {
  const btnIocn = document.querySelector("#bookmarkBtn i");
  const btn = document.querySelector("#bookmarkBtn");

  try {
    if (btn.classList.contains("bookmarkButton-off")) {
      // 로그인 여부 체크
      if (document.cookie.includes("authToken=")) {
        const videoId = document.getElementById("videoId").value;
        // 북마크를 안했을 때
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
            headers: { Authorization: `Bearer ${getAuthToken()}` },
          },
        );

        if (response.status === 201) {
          console.log("북마크가 성공적으로 저장되었습니다!");
          alert("북마크가 성공적으로 저장되었습니다!");
        } else {
          throw new Error("북마크 저장 실패");
        }
      } else {
        alert("로그인 후 이용가능합니다");
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
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (response.status === 200) {
        console.log("북마크가 성공적으로 삭제되었습니다!");
        alert("북마크가 성공적으로 삭제되었습니다!");
      } else {
        throw new Error("북마크 삭제 실패");
      }
    }
  } catch (error) {
    console.error("북마크 처리 중 오류 발생:", error.response?.data || error);
    alert("북마크 처리 중 문제가 발생했습니다.");
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
  try {
    const response = await axios.get(`/notes`, {
      params: { videoId },
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (response.data.success) {
      currentNote = response.data.note;
      populateEditors();
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
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    Code,
    Essentials,
    FindAndReplace,
    Heading,
    Highlight,
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
    Markdown,
    MediaEmbed,
    Paragraph,
    PasteFromMarkdownExperimental,
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
        "findAndReplace",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "code",
        "|",
        "specialCharacters",
        "link",
        "insertImageViaUrl",
        "mediaEmbed",
        "insertTable",
        "highlight",
        "blockQuote",
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
      Autoformat,
      AutoImage,
      Autosave,
      BlockQuote,
      Bold,
      Code,
      Essentials,
      FindAndReplace,
      Heading,
      Highlight,
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
      Markdown,
      MediaEmbed,
      Paragraph,
      PasteFromMarkdownExperimental,
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
    initialData: "🌽🥬🫑<h3>재료를 입력해보세요!😊</h3>",
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
    placeholder: "🌽🥬🫑 재료를 입력해주세요!😊",
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
        "findAndReplace",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "code",
        "|",
        "specialCharacters",
        "link",
        "insertImageViaUrl",
        "mediaEmbed",
        "insertTable",
        "highlight",
        "blockQuote",
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
      Autoformat,
      AutoImage,
      Autosave,
      BlockQuote,
      Bold,
      Code,
      Essentials,
      FindAndReplace,
      Heading,
      Highlight,
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
      Markdown,
      MediaEmbed,
      Paragraph,
      PasteFromMarkdownExperimental,
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
    initialData: "📌🪄<h3>레시피를 입력해보세요!🧑‍🍳</h3>",
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
    placeholder: "📌🪄레시피를 입력해주세요!🧑‍🍳",
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
      if (currentNote && currentNote.ingredients) {
        ingEditor.setData(currentNote.ingredients);
      }

      document
        .querySelector(".memoItem.ing .registr")
        .addEventListener("click", async () => {
          const editorData = ingEditor.getData();
          await saveOrUpdateMemo(editorData, "ingredients");
        });
    })
    .catch((error) => {
      console.error("CKEditor 초기화 오류 (재료):", error);
    });

  // 레시피 에디터 초기화
  ClassicEditor.create(document.querySelector("#rcpData"), rcpDataConfig)
    .then((editor) => {
      rcpEditor = editor;
      if (currentNote && currentNote.recipe) {
        rcpEditor.setData(currentNote.recipe);
      }

      document
        .querySelector(".memoItem.rcp .registr")
        .addEventListener("click", async () => {
          const editorData = rcpEditor.getData();
          await saveOrUpdateMemo(editorData, "recipe");
        });
    })
    .catch((error) => {
      console.error("CKEditor 초기화 오류 (레시피):", error);
    });
}

// 에디터에 데이터 채우기 함수
function populateEditors() {
  if (currentNote) {
    if (currentNote.ingredients) {
      ingEditor.setData(currentNote.ingredients);
    }
    if (currentNote.recipe) {
      rcpEditor.setData(currentNote.recipe);
    }
  }
}

// 메모 생성 또는 수정 함수
async function saveOrUpdateMemo(data, noteType) {
  const videoId = document.getElementById("videoId").value;
  const title = document.getElementById("title").value;
  const channelTitle = document.getElementById("channelTitle").value;
  const thumbnailUrl = document.getElementById("thumbnailUrl").value;

  try {
    if (currentNote) {
      // Update existing note
      const payload =
        noteType === "ingredients" ? { ingredients: data } : { recipe: data };
      const response = await axios.patch(`/notes/${currentNote.id}`, payload, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert(
          `${
            noteType === "ingredients" ? "재료" : "레시피"
          } 메모가 성공적으로 업데이트되었습니다.`,
        );
        window.location.reload();
      } else {
        alert(
          `${
            noteType === "ingredients" ? "재료" : "레시피"
          } 메모 업데이트에 실패했습니다.`,
        );
      }
    } else {
      // Create new note
      const payload = {
        [noteType]: data,
        videoId,
        title,
        channelTitle,
        thumbnailUrl,
      };
      const response = await axios.post("/notes", payload, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert(
          `${
            noteType === "ingredients" ? "재료" : "레시피"
          } 메모가 성공적으로 저장되었습니다.`,
        );
        window.location.reload();
      } else {
        alert(
          `${
            noteType === "ingredients" ? "재료" : "레시피"
          } 메모 저장에 실패했습니다.`,
        );
      }
    }
  } catch (error) {
    console.error(
      `${
        noteType === "ingredients" ? "재료" : "레시피"
      } 메모 저장/업데이트 오류:`,
      error,
    );
    alert(
      `${
        noteType === "ingredients" ? "재료" : "레시피"
      } 메모 저장/업데이트 중 오류가 발생했습니다.`,
    );
  }
}

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
