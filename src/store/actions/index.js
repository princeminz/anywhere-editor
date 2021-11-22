import { loader } from "@monaco-editor/react";
import monacoThemes from "../../themes";

const changeValue = function ({ state }, value) {
  state.editorValue = value;
};
const setSelectedLanguageId =
  () =>
  ({ state }, id) => {
    state.selectedLanguageId = id;
  };

const setSelectedSubmissionLanguageId = function ({ state }, Id) {
  state.selectedSubmissionLanguageId = Id;
};

const editor = {
  setSelectedLanguageId: setSelectedLanguageId(),
  setMonacoTheme({ state }, theme) {
    state.monacoTheme = theme;
  },
};

const displayResult = function ({ state }) {
  state.editorHeight = "47vh";
  state.isResultDisplayed = true;
  state.isResultFetched = false;
};

const hideResult = function ({ state }) {
  state.editorHeight = "87vh";
  state.isResultDisplayed = false;
};

const setResultData = function ({ state }, data) {
  state.resultData = data;
};

const setResultFetchedStatus = function ({ state }, status) {
  state.isResultFetched = status;
};

const defineTheme = ({ state }, theme) => {
  return new Promise((res) => {
    Promise.all([loader.init()])
      .then(([monaco]) => {
        console.log("theme changing to ", theme);
        monaco.editor.defineTheme(
          theme,
          monacoThemes[theme.replace(/-/g, "_")]
        );
        res();
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

const setSubmissionLanguages = ({ state }, Languages) => {
  state.submissionLanguages = Languages;
};

export {
  changeValue,
  setSelectedLanguageId,
  editor,
  defineTheme,
  displayResult,
  hideResult,
  setResultData,
  setResultFetchedStatus,
  setSubmissionLanguages,
  setSelectedSubmissionLanguageId,
};
