import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useAppState, useActions } from "../store";
import React from "react";
import { parse, getParserToUse, submit } from "../TestcaseParser";
import { htmlToElement } from "../utils/dom";

export default function ContainedButtons() {
  const state = useAppState();
  const actions = useActions();
  // const url = "https://judge.samarpitminz.com";
  const url = "https://ce.judge0.com";

  const parser = getParserToUse();

  function fetchResult(tokens) {
    let tokenstr = tokens.join(",");
    fetch(
      `${url}/submissions/batch?tokens=${tokenstr}&base64_encoded=false&fields=message,stdout,stderr,status,language_id,stdin,time,token`
    )
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        let flag = true;
        for (const submission of res.submissions) {
          if (submission.status.id < 3) {
            flag = false;
            fetchResult(tokens);
            break;
          }
        }

        if (flag) {
          console.log(res);
          actions.setResultData(res);
          actions.setResultFetchedStatus(true);
        }
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  function runTestCases() {
    if (state.editorValue.replace(/\s/g, "") == "") {
      return false;
    }
    actions.displayResult();

    const Data = parse(parser);
    console.log("time Limit", Data.timeLimit);

    let submissions = { submissions: [] };
    Data.testcases.forEach((testcase) => {
      const data = {
        source_code: state.editorValue,
        language_id: state.selectedLanguageId,
        stdin: testcase[0].replace(/<br>/g, "\n"),
        expected_output: testcase[1].replace(/<br>/g, "\n"),
        cpu_time_limit: Data.timeLimit,
      };
      submissions.submissions.push(data);
    });
    console.log("submission:", submissions);
    fetch(`${url}/submissions/batch?base64_encoded=false`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissions),
    })
      .then((result) => {
        console.log("token here", result.status);
        return result.json();
      })
      .then((res) => {
        console.log(res);
        let tokens = [];
        res.forEach((tokenobj) => {
          tokens.push(tokenobj.token);
        });
        fetchResult(tokens);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  function Submit() {
    parser.submit(
      window.location.href,
      state.editorValue,
      state.selectedSubmissionLanguageId
    );
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="flex-end"
      sx={{ margin: "10px 3px" }}
    >
      <Button
        variant="contained"
        onClick={runTestCases}
        sx={{ fontSize: "1.2rem" }}
      >
        Run All Testcases
      </Button>
      <Button variant="contained" onClick={Submit} sx={{ fontSize: "1.2rem" }}>
        Submit
      </Button>
    </Stack>
  );
}
