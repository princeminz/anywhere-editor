import { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import monacoThemes from "monaco-themes/themes/themelist.json";
import { useAppState, useActions } from "../store";
import config from "../config";
import Stack from "@mui/material/Stack";
import useStyles from "./useStyles";
import React from "react";
import { fontSize } from "@mui/system";
import { getParserToUse } from "../TestcaseParser";

const Header = (_) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const state = useAppState();
  const action = useActions();
  const parser = getParserToUse();
  if (Object.keys(state.submissionLanguages).length == 1) {
    parser.getLanguages(window.location.href).then((res) => {
      action.setSubmissionLanguages(res);
      action.setSelectedSubmissionLanguageId(
        window.location.href + "selectedSubmissionLanguageId" in
          window.localStorage
          ? window.localStorage.getItem(
              window.location.href + "selectedSubmissionLanguageId"
            )
          : Object.keys(res)[0]
      );
    });
  }

  function handleLanguageChange(ev) {
    console.log(ev);
    action.editor.setSelectedLanguageId(ev.target.value);
    window.localStorage.setItem(
      window.location.href + "selectedLanguageId",
      ev.target.value
    );
  }

  function handleSubmitLanguageChange(ev) {
    action.setSelectedSubmissionLanguageId(ev.target.value);
    window.localStorage.setItem(
      window.location.href + "selectedSubmissionLanguageId",
      ev.target.value
    );
  }
  const editorRef = useRef();

  function getEditorValue() {
    return editorRef.current?.getValue();
  }

  function handleEditorDidMount(editor, monaco) {
    setIsEditorReady(true);
    editorRef.current = editor;
  }
  function handleThemeChange(ev) {
    const theme = ev.target.value;
    window.localStorage.setItem(
      window.location.href + "monacoTheme",
      ev.target.value
    );

    if (config.defaultThemes.includes(theme)) {
      action.editor.setMonacoTheme(theme);
    } else {
      action
        .defineTheme(theme)
        .then((_) => action.editor.setMonacoTheme(theme));
    }
  }

  function getEditorValue() {
    return editorRef.current.getValue();
  }

  return (
    <Stack direction="row" spacing={2} justifyContent="space-evenly">
      <TextField
        select
        variant="filled"
        value={state.selectedLanguageId}
        onChange={handleLanguageChange}
        className="full-width"
        label="Editor Language"
        sx={{ width: "30%" }}
      >
        {Object.keys(config.supportedLanguages).map((key, index) => (
          <MenuItem key={key} value={key}>
            {config.supportedLanguages[key].lang}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        variant="filled"
        value={state.monacoTheme}
        onChange={handleThemeChange}
        className="full-width"
        label="Theme"
        style={{ width: "30%" }}
      >
        {config.defaultThemes.map((theme) => (
          <MenuItem key={theme} value={theme}>
            {theme}
          </MenuItem>
        ))}
        {Object.entries(monacoThemes).map(([themeId, themeName]) => (
          <MenuItem key={themeId} value={themeId}>
            {themeName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        variant="filled"
        value={state.selectedSubmissionLanguageId}
        onChange={handleSubmitLanguageChange}
        className="full-width"
        label="Submission Language"
        sx={{ width: "30%" }}
      >
        {Object.keys(state.submissionLanguages).map((key, index) => (
          <MenuItem key={key} value={key}>
            {state.submissionLanguages[key]}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default Header;
