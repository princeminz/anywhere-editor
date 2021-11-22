import Editor from "./Editor";
import ResizePanel from "react-resize-panel";
import React from "react";
import Header from "./Header";
import ResultDisplay from "./ResultDisplay";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import Footer from "./Footer";

function HeadComp() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <ScopedCssBaseline>
        <ResizePanel direction="w" style={{ flexGrow: "1", width: "40vw" }}>
          <div style={{ width: "100%" }}>
            <Header />
            <Editor />
            <ResultDisplay />

            <Footer />
          </div>
        </ResizePanel>
      </ScopedCssBaseline>
    </ThemeProvider>
  );
}

export default HeadComp;
