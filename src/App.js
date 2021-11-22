import React from "react";
import ReactDOM from "react-dom";
import HeadComp from "./components.js";
import { Provider } from "overmind-react";
import { store } from "./store";
import Editor from "./Editor";


function initialize() {
  let div = document.createElement("div");
  div.id = "wrap";
  div.style.flexGrow = "1";
  div.style.overflowY = "scroll";

  div.style.maxHeight = "100vh";

  while (document.body.firstChild) {
    div.appendChild(document.body.firstChild);
  }
  document.body.appendChild(div);
  const ele = document.createElement("div");
  document.body.appendChild(ele);
  document.body.style.display = "flex";
  document.body.style.minHeight = "100%";
  document.body.style.padding = "0";
  document.body.style.overflowY = "hidden";

  function App() {
    return (
      <Provider value={store}>
        <HeadComp />
      </Provider>
    );
  }

  ReactDOM.render(<App />, ele);
}

document.body.onload = initialize;
