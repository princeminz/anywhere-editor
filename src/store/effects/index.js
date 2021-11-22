import { loader } from "@monaco-editor/react";
import monacoThemes from "monaco-themes/themes/themelist.json";
import amy from "monaco-themes";

const defineTheme = (theme) => {
  return new Promise((res) => {
    Promise.all([loader.init()])
      .then(([monaco]) => {
        console.log(monaco);
        monaco.editor.defineTheme(theme, amy);
        res();
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

export { defineTheme };
