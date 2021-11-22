import config from "../../config";

const initialState = {
  selectedLanguageId:
    window.location.href + "selectedLanguageId" in window.localStorage
      ? window.localStorage.getItem(window.location.href + "selectedLanguageId")
      : 63,
  selectedSubmissionLanguageId: 0,
  editorHeight: "87vh",
  editorValue:
    window.location.href + "editorValue" in window.localStorage
      ? window.localStorage.getItem(window.location.href + "editorValue")
      : "// type here",
  monacoTheme:
    window.location.href + "monacoTheme" in window.localStorage
      ? window.localStorage.getItem(window.location.href + "monacoTheme")
      : "vs-dark",
  isResultDisplayed: false,
  isResultFetched: false,
  resultData: null,
  submissionLanguages: { 0: "" },
};

export { initialState };
