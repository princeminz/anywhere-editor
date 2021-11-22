var s = document.createElement("script");
s.src = chrome.runtime.getURL("App.js");
console.log(s.src);
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
