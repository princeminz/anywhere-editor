import React, { useRef } from "react";
import { useAppState, useActions } from "./store";
import config from "./config";

import MonacoEditor from "@monaco-editor/react";


const Editor = (_) => {
  const editorRef = useRef(null);
  const state = useAppState();
  const action = useActions();

  function onvaluechange() {
    const editorValue = editorRef.current.getValue();
    action.changeValue(editorValue);
    window.localStorage.setItem(
      window.location.href + "editorValue",
      editorValue
    );
  }


  const language = config.supportedLanguages[state.selectedLanguageId].editor;


  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  if (config.defaultThemes.includes(state.monacoTheme)) {
    action.editor.setMonacoTheme(state.monacoTheme);
  } else {
    action
      .defineTheme(state.monacoTheme)
      .then((_) => action.editor.setMonacoTheme(state.monacoTheme));
  }



  return (
    <div style={{ height: state.editorHeight }}>
      <MonacoEditor
        automaticLayout={true}
        theme={state.monacoTheme}
        defaultValue={state.editorValue}
        defaultLanguage={language}
        path={language}
        onMount={handleEditorDidMount}
        onChange={onvaluechange}
      />
    </div>
  );
};

export default Editor;
