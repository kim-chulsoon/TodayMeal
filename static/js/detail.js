const more = document.querySelector(".moreLine");
const form = document.forms["bookmark"];

// 에디터 전역화
let ingEditor;
let rcpEditor;

console.log(document.querySelector(".btn btnOpen registr"));
// 영상 설명 더보기/숨기기
more.addEventListener("click", () => {
  const subtitle = document.querySelector(".subtitle");
  const moreText = more.querySelector("p");

  //   설명 더보기 버튼
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
});

// 북마크 토글 애니메이션 및 상태설정
function toggle_bookmark() {
  const btnIocn = document.querySelector("#bookmarkBtn i");
  const btn = document.querySelector("#bookmarkBtn");
  console.log(
    document.querySelector("#bookmarkBtn").getAttribute("data-status"),
  );

  if (btn.classList.contains("bookmarkButton-off")) {
    // 북마크를 안했을때
    btn.setAttribute("data-status", true); // 북마크 활성화
    btnIocn.classList.remove("fa-regular");
    btn.classList.remove("bookmarkButton-off");
    btn.classList.add("bookmarkButton-on");
    btnIocn.classList.add("fa-solid");
  } else {
    // 북마크를 한 상태일때
    btn.setAttribute("data-status", false); // 북마크 비활성화
    btn.classList.remove("bookmarkButton-on");
    btnIocn.classList.remove("fa-solid");
    btn.classList.add("bookmarkButton-off");
    btnIocn.classList.add("fa-regular");
  }
}

// 재료메모 폼 변환
function ingForm() {
  const ing = document.querySelector(".memoItem.ing");
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

// 재료메모 폼 변환
function rcpForm() {
  console.log("test");
  const rcp = document.querySelector(".memoItem.ing");
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

// 재료 메모 저장 함수
async function saveIngredientsMemo(data) {
  const videoId = document.getElementById("videoId").value;
  const title = document.getElementById("title").value;

  try {
    const response = await axios.post(
      "/detail/notes",
      { ingredients: data, videoId, title },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 201 || response.status === 200) {
      // 수정폼 닫음
      ingForm();
      alert("재료 메모가 성공적으로 저장되었습니다.");

      window.location.reload();
    } else {
      alert("재료 메모 저장에 실패했습니다.");
    }
  } catch (error) {
    console.error("재료 메모 저장 오류:", error);
    alert("재료 메모 저장 중 오류가 발생했습니다.");
  }
}

// 레시피 메모 저장 함수
async function saveRecipeMemo(data) {
  const videoId = document.getElementById("videoId").value;
  const title = document.getElementById("title").value;

  try {
    const response = await axios.post(
      "/detail/notes",
      { recipe: data, videoId, title },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 201 || response.status === 200) {
      // 수정폼 닫음
      rcpForm();
      alert("레시피 메모가 성공적으로 저장되었습니다.");
      window.location.reload();
    } else {
      alert("레시피 메모 저장에 실패했습니다.");
    }
  } catch (error) {
    console.error("레시피 메모 저장 오류:", error);
    alert("레시피 메모 저장 중 오류가 발생했습니다.");
  }
}

// 재료수정
function ingMemo(data) {
  axios({
    method: "post",
    url: "/",
    data: { ingredients: data },
  });
}

// 레시피수정
function rcpMemo(data) {
  axios({
    method: "post",
    url: "/",
    data: { recipe: data },
  });
}

// 메모창 초기화 버튼
function ingReset() {
  ingEditor.setData("");
}
function rcpReset() {
  rcpEditor.setData("");
}

// 에디터 설정값

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
  "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzU5NDg3OTksImp0aSI6IjVmOWE0ZGQyLWMzYzQtNDg5Mi1iY2QwLTViM2M5ODA1ZDk1OCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImNkNzM5MjZkIn0.9WN2-KluRHp_8-XGw6Pv49HIK2wRp7VfIAYOc3XW_0dt5Qa3qZbeEJdZ7KkggkoevWri-sL6FF7eoteWbmYtyw";

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
ClassicEditor.create(document.querySelector("#ingData"), ingDataConfig)
  .then((editor) => {
    ingEditor = editor;
    document
      .querySelector(".memoBox .ingForm-Open .btnOpen.registr")
      .addEventListener("click", async () => {
        const editorData = editor.getData();
        await saveIngredientsMemo(editorData);
      });
  })
  .catch((error) => {
    console.error("CKEditor 초기화 오류 (재료):", error);
  });

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

ClassicEditor.create(document.querySelector("#rcpData"), rcpDataConfig)
  .then((editor) => {
    rcpEditor = editor;
    document
      .querySelector(".memoBox .rcpForm-Open .btnOpen.registr")
      .addEventListener("click", async () => {
        const editorData = editor.getData();
        await saveRecipeMemo(editorData);
      });
  })
  .catch((error) => {
    console.error("CKEditor 초기화 오류 (레시피):", error);
  });
