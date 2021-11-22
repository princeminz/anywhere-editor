import { htmlToElement } from "../../utils/dom";
import { Parser } from "../Parser";

export class CSESProblemParser extends Parser {
  constructor() {
    super();
    this.languages = { 0: "" };
  }

  getMatchPatterns() {
    return ["https://cses.fi/*/task/*"];
  }

  parse(url, html) {
    const elem = htmlToElement(html);

    // task.setName(elem.querySelector('.title-block > h1').textContent);
    // task.setCategory(elem.querySelector('.title-block > h3 > a').textContent);

    const limitsStr = elem.querySelector(".task-constraints").textContent;
    const timeLimit = parseFloat(/([0-9.]+) s/.exec(limitsStr)[1]);
    // task.setMemoryLimit(parseInt(/(\d+) MB/.exec(limitsStr)[1], 10));

    // Grabs the first two code blocks after each "example" header, to avoid
    // matching code blocks in the problem statement or explanations.
    const find = function (nodes) {
      let count = 0;
      const result = [];
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id.startsWith("example")) {
          count = 2;
          continue;
        }
        if (count > 0) {
          result.push(nodes[i]);
          count--;
        }
      }
      return result;
    };

    let testcases = [];
    const codeBlocks = find([
      ...elem.querySelectorAll("[id^=example], .content > code"),
    ]);
    for (let i = 0; i < codeBlocks.length - 1; i += 2) {
      testcases.push([
        codeBlocks[i].textContent,
        codeBlocks[i + 1].textContent,
      ]);
    }

    return { testcases, timeLimit };
  }

  submit(url, source_code, languageId) {
    fetch(url.replace("task/", "submit/"))
      .then((res) => res.text())
      .then((res) => {
        const form = htmlToElement(res).querySelector(".content");
        form.style.display = "none";
        document.body.appendChild(form);

        let file = new File([source_code], "code", {
          type: "text/plain",
          lastModified: new Date().getTime(),
        });
        let container = new DataTransfer();
        container.items.add(file);
        form.querySelector('input[name="file"]').files = container.files;

        form.querySelector("#lang").value = languageId;
        const optionEl = document.createElement("option");
        optionEl.value = this.options[languageId][1];
        form.querySelector("#option").appendChild(optionEl);

        console.log("Submitting problem");
        const submitBtn = form.querySelector('input[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.click();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async getLanguages(url) {
    await fetch(url.replace("task/", "submit/"))
      .then((res) => res.text())
      .then((res) => {
        const form = htmlToElement(res).querySelector(".content");
        this.languages = { "": "" };
        for (const lang of form.querySelector("#lang").children) {
          this.languages[lang.value] = lang.value;
        }
        delete this.languages[""];
        console.log("language", this.languages);
        this.options = JSON.parse(
          form.querySelector("script").text.match(/var options = ([^\n]*)/)[1]
        );
        console.log("options", this.options);
      })
      .catch((e) => {
        console.log(e);
      });
    return this.languages;
  }
}
