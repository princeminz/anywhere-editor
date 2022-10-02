import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import MonacoEditor from "./editor";
import useLocalStorage from "./useLocalStorage";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

function SelectList(props) {
  return (
    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id={props.name+"-select-label"}>{props.name}</InputLabel>
      <Select
        labelId={props.name+"-select-label"}
        id={props.name+"-select"}
        onChange={props.handleChange}
      >
        {
          props.list.map(item => {
            return <MenuItem value={item} key={item}>{item}</MenuItem>
          })
        }
      </Select>
    </FormControl>
  )
}

function runCode(language, compiler, selectedOptions) {
  console.log(language, compiler, selectedOptions)
  const data = {
    "code": "#include <iostream>\nint main() { std::cout << \"hoge\" << std::endl; }",
    "options": "",
    "compiler": "gcc-head",
    "compiler-option-raw": "",
  }

  var requestOptions = {
    method: 'POST',
    headers: { 
      Accept: 'application.json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch("https://wandbox.org/api/compile.json", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
// need a more robust size calculation for test case editors
export default function Testcases(props) {
  const [language, setLanguage] = useState('');
  const [compiler, setCompiler] = useState('');

  const selectedOptions = {}
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCompilerChange = (event) => {
    setCompiler(event.target.value);
  };

  const handleOptionChange = (key) => (event) => {
    selectedOptions[key] = event.target.value;
  }
  
  return (
    <div>
      <SelectList name="language" handleChange={handleLanguageChange} list={Object.keys(props.languageCompilerMap)} />
      <SelectList name="compiler" handleChange={handleCompilerChange} list={props.languageCompilerMap[language]} />
      {
        props.compilerOptionsMap[compiler].map(option => {
          if(option.type == 'select')
            return (
              <SelectList name={option.name} handleChange={handleOptionChange(option.name)} list={option.options.map(item => item["display-name"])} />
            )
        })
      }
      <FormGroup>
        {
          props.compilerOptionsMap[compiler].map(option => {
            if(option.type == 'single') 
              return <FormControlLabel control={<Checkbox />} label={option['display-name']} />
          })
        }
      </FormGroup>
      <Button variant="contained" onClick={() => runCode(language, compiler, selectedOptions)}>Run</Button>
      <div>
        {props.task.tests.map((test, index) => {
          const [inputValue, setInputValue] = useLocalStorage(`testcaseinput${index}`, test.input);
          const [outputValue, setOutputValue] = useLocalStorage(`testcaseoutput${index}`, test.output);

          return (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id={`panel${index + 1}a-header`}
              >
                <Typography>Test {index + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ height: "40vh", display: "flex", flexDirection: "column" }}
              >
                <Typography sx={{ padding: "4px" }}>Input</Typography>
                <MonacoEditor value={inputValue} setValue={setInputValue} />
                <Typography sx={{ padding: "4px" }}>Output</Typography>
                <MonacoEditor value={outputValue} setValue={setOutputValue} />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}
