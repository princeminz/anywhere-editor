import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import MonacoEditor from "./editor";
import Testcases from "./testcases";
import useLocalStorage from "./useLocalStorage";
import getCompilerInfo from "./wandbox";
import getTask from "./ccparser";

export default function Tabs() {
  const [value, setValue] = useState("1");
  const [editorValue, setEditorValue] = useLocalStorage('editor-val', "type your code")
  const [languageCompilerMap, setLanguageCompilerMap] = useState({'': []});
  const [compilerOptionsMap, setCompilerOptionsMap] = useState({'': []});
  const [task, setTask] = useState({'tests': []});

  useEffect(async () => {
    const task = await getTask()
    setTask(task)
  }, [])

  useEffect(async () => {
    const { languageCompilerMap, compilerOptionsMap } = await getCompilerInfo()
    setLanguageCompilerMap(languageCompilerMap)
    setCompilerOptionsMap(compilerOptionsMap)
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Editor" value="1" />
            <Tab label="Test Cases" value="2" />
            <Tab label="Submit" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" className="monaco-tab-panel" sx={{ padding: 0 }}>
          <MonacoEditor
            value={editorValue}
            setValue={setEditorValue}
            language="javascript"
            minimap={true}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" sx={{ margin: "5px" }}>Run</Button>
            <Button variant="contained" sx={{ margin: "5px" }}>Submit</Button>
          </div>
        </TabPanel>
        <TabPanel value="2" className="test-cases-tab-panel">
          <Testcases task={task} editorValue={editorValue} languageCompilerMap={languageCompilerMap} compilerOptionsMap={compilerOptionsMap}/>
        </TabPanel>
        <TabPanel value="3" className="submission-tab-panel">
          {/* <Submit /> */}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
