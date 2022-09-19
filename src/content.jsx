import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./content.css";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import Tabs from "./tabpage";
import task from "./ccparser";
import CssBaseline from "@mui/material/CssBaseline";

// need to write custom CSS overrides for different websites
function App() {
  const [sizes, setSizes] = useState([
    "60%",
    "auto",
  ]);

  const layoutCSS = {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "scroll",
  };

  return (
    <div style={{ height: "100vh" }}>
      <SplitPane
        split="vertical"
        sizes={sizes}
        onChange={setSizes}
      >
        <Pane minSize="30%">
          <div id="body-pane" style={layoutCSS}></div>
        </Pane>
        <Pane minSize="30%">
          <CssBaseline />
          <Tabs />
        </Pane>
      </SplitPane>
    </div>
  );
}

if (task !== null) {
  const bodyPaneDiv = document.createElement("div");
  while (document.body.firstChild) {
    bodyPaneDiv.appendChild(document.body.firstChild);
  }

  const wrapDiv = document.createElement("div");
  wrapDiv.id = "wrap";
  document.body.appendChild(wrapDiv);

  ReactDOM.render(<App />, wrapDiv);
  document.getElementById("body-pane").appendChild(bodyPaneDiv);
}

export default App;
