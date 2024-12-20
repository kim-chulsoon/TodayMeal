const more = document.querySelector(".moreLine");
const form = document.forms["bookmark"];

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

// 토글 애니메이션
function toggle_bookmark() {
  let btn = document.querySelector(".bookmark");
  btn.addEventListener("click", () => {
    // 현재 스타일 속성을 기반으로 토글
    btn.classList.toggle(".ookmarkButton-off");
  });
}

// AXIOS 메모 수정함수

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

ClassicEditor.create(document.querySelector("#ingData"), ingDataConfig).then(
  (editor) => {
    // 버튼 클릭 시 입력 데이터 가져옴
    document
      .querySelector(".memoBox .ingrForm .btnOpen")
      .addEventListener("click", () => {
        const editorData = editor.getData();
        console.log(editorData);
        // 입력값 전송
        ingMemo(editorData);
      });
  },
);

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

ClassicEditor.create(document.querySelector("#rcpData"), rcpDataConfig).then(
  (editor) => {
    // 버튼 클릭 시 입력 데이터 가져옴
    document
      .querySelector(".memoBox .rcprForm .btnOpen")
      .addEventListener("click", () => {
        const editorData = editor.getData();
        console.log(editorData);
        // 레시피값 전송
        rcpMemo(editorData);
      });
  },
);
