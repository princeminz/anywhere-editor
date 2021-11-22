import { decodeHtml, htmlToElement } from "../../utils/dom";
import { Parser } from "../Parser";

export class CodeforcesProblemParser extends Parser {
  constructor() {
    super();
    this.languages = { 0: "" };
  }

  getMatchPatterns() {
    const patterns = [];

    [
      "https://codeforces.com/contest/*/problem/*",
      "https://codeforces.com/problemset/problem/*/*",
      "https://codeforces.com/gym/*/problem/*",
      "https://codeforces.com/group/*/contest/*/problem/*",
      "https://codeforces.com/problemsets/acmsguru/problem/*/*",
      "https://codeforces.com/edu/course/*/lesson/*/*/practice/contest/*/problem/*",
    ].forEach((pattern) => {
      patterns.push(pattern);
      patterns.push(
        pattern.replace("https://codeforces.com", "https://*.codeforces.com")
      );
    });

    const mlPatterns = patterns.map((pattern) =>
      pattern.replace(".com", ".ml")
    );
    const esPatterns = patterns.map((pattern) =>
      pattern.replace("codeforces.com", "codeforc.es")
    );

    const httpsPatterns = patterns.concat(mlPatterns).concat(esPatterns);
    const httpPatterns = httpsPatterns.map((pattern) =>
      pattern.replace("https://", "http://")
    );

    return httpsPatterns.concat(httpPatterns);
  }

  parse(url, html) {
    if (url.includes("/problemsets/acmsguru")) {
      const elem = htmlToElement(html);
      const table = elem.querySelector(
        ".problemindexholder > .ttypography > table"
      );

      if (table) {
        return this.parseAcmSguRuProblemInsideTable(html);
      } else {
        return this.parseAcmSguRuProblemNotInsideTable(html);
      }
    } else {
      return this.parseMainProblem(html, url);
    }
  }

  submit(url, source_code, languageId) {
    fetch(url.replace("problem/", "submit/"))
      .then((res) => res.text())
      .then((res) => {
        console.log(htmlToElement(res).querySelector(".submit-form"));
        const submitEl = htmlToElement(res).querySelector(".submit-form");
        submitEl.style.display = "none";
        const languageEl = submitEl.querySelector(
          'select[name="programTypeId"]'
        );
        const sourceCodeEl = submitEl.querySelector("#sourceCodeTextarea");

        sourceCodeEl.value = source_code;
        languageEl.value = languageId;
        document.body.appendChild(submitEl);
        console.log("Submitting problem");
        const submitBtn = submitEl.querySelector(".submit");
        submitBtn.disabled = false;
        submitBtn.click();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async getLanguages(url) {
    await fetch(url.replace("problem/", "submit/"))
      .then((res) => res.text())
      .then((res) => {
        const submitEl = htmlToElement(res).querySelector(".submit-form");
        this.languages = {};
        const languageEl = submitEl.querySelector(
          'select[name="programTypeId"]'
        );

        for (const lang of languageEl.children) {
          this.languages[lang.value] = lang.innerText;
        }
        console.log("language", this.languages);
        console.log("in languages");
      })
      .catch((e) => {
        console.log(e);
      });
    return this.languages;
  }

  parseMainProblem(html, url) {
    const elem = htmlToElement(html);

    // task.setName(elem.querySelector('.problem-statement > .header > .title').textContent.trim());

    // if (url.includes('/edu/')) {
    //   const breadcrumbs = [...elem.querySelectorAll('.eduBreadcrumb > a')].map(el => el.textContent.trim());
    //   breadcrumbs.pop();
    //   // task.setCategory(breadcrumbs.join(' - '));
    // } else {
    //   const contestType = url.includes('/gym/') ? 'gym' : 'contest';
    //   const titleElem = elem.querySelector(`.rtable > tbody > tr > th > a[href*=${contestType}]`);

    //   if (titleElem !== null) {
    //     task.setCategory(titleElem.textContent.trim());
    //   }
    // }

    // const interactiveKeywords = ['Interaction', 'Протокол взаимодействия'];
    // const isInteractive = [...elem.querySelectorAll('.section-title')].some(
    //   el => interactiveKeywords.indexOf(el.textContent) > -1,
    // );

    // task.setInteractive(isInteractive);

    const timeLimitNode = this.getLastTextNode(
      elem,
      ".problem-statement > .header > .time-limit"
    );
    const timeLimitStr = timeLimitNode.textContent.split(" ")[0];
    const timeLimit = parseFloat(timeLimitStr);

    // const memoryLimitNode = this.getLastTextNode(elem, '.problem-statement > .header > .memory-limit');
    // const memoryLimitStr = memoryLimitNode.textContent.split(' ')[0];
    // task.setMemoryLimit(parseInt(memoryLimitStr, 10));

    // const inputFile = this.getLastTextNode(elem, '.problem-statement > .header > .input-file').textContent;
    // if (inputFile !== 'standard input' && inputFile !== 'стандартный ввод') {
    //   task.setInput({
    //     fileName: inputFile,
    //     type: 'file',
    //   });
    // }

    // const outputFile = this.getLastTextNode(elem, '.problem-statement > .header > .output-file').textContent;
    // if (outputFile !== 'standard output' && outputFile !== 'стандартный вывод') {
    //   task.setOutput({
    //     fileName: outputFile,
    //     type: 'file',
    //   });
    // }

    const inputs = elem.querySelectorAll(".input pre");
    const outputs = elem.querySelectorAll(".output pre");
    let testcases = [];
    for (let i = 0; i < inputs.length && i < outputs.length; i++) {
      testcases.push([
        decodeHtml(inputs[i].innerHTML),
        decodeHtml(outputs[i].innerHTML),
      ]);
    }
    return { testcases, timeLimit };
  }

  parseAcmSguRuProblemInsideTable(html) {
    const elem = htmlToElement(html);

    // task.setName(elem.querySelector('.problemindexholder h3').textContent.trim());
    // task.setCategory('acm.sgu.ru archive');

    const timeLimit = parseFloat(
      /time limit per test: ([0-9.]+)\s+sec/.exec(html)[1]
    );
    // task.setMemoryLimit(Math.floor(parseInt(/memory\s+limit per test:\s+(\d+)\s+KB/.exec(html)[1], 10) / 1000));

    const blocks = elem.querySelectorAll("font > pre");
    let testcases = [];
    for (let i = 0; i < blocks.length - 1; i += 2) {
      testcases.push([blocks[i].textContent, blocks[i + 1].textContent]);
    }
    return { testcases, timeLimit };
  }

  parseAcmSguRuProblemNotInsideTable(html) {
    const elem = htmlToElement(html);

    // task.setName(elem.querySelector('.problemindexholder h4').textContent.trim());
    // task.setCategory('acm.sgu.ru archive');

    const timeLimit = parseFloat(
      /Time\s+limit per test: ([0-9.]+)\s+sec/i.exec(html)[1]
    );

    // task.setMemoryLimit(
    //   Math.floor(parseInt(/Memory\s+limit(?: per test)*: (\d+)\s+(?:kilobytes|KB)/i.exec(html)[1], 10) / 1000),
    // );
    let testcases = [];
    elem.querySelectorAll("table").forEach((table) => {
      const blocks = table.querySelectorAll("pre");
      if (blocks.length === 4) {
        testcases.push([blocks[2].textContent, blocks[3].textContent]);
      }
    });
    return { testcases, timeLimit };
  }

  getLastTextNode(elem, selector) {
    let selectedNode = elem.querySelector(selector);

    const cursiveNode = selectedNode.querySelector(".tex-font-style-sl");
    if (cursiveNode !== null) {
      selectedNode = cursiveNode;
    }

    const textNodes = [...selectedNode.childNodes].filter(
      (node) => node.nodeType === Node.TEXT_NODE
    );
    return textNodes[textNodes.length - 1];
  }
}
