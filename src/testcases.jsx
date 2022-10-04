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
import MonacoDiffEditor from "./diffEditor";

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
            return <MenuItem value={item} key={item} >{item}</MenuItem>
          })
        }
      </Select>
    </FormControl>
  )
}

function SelectListAPI(props) {
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
            return <MenuItem value={item['name']} key={item['name']} >{item['display-name']}</MenuItem>
          })
        }
      </Select>
    </FormControl>
  )
}

async function runCode(code, input, compiler, selectedOptions) {
  const options = Object.values(selectedOptions).join()
  console.log(options)
  const data = {
    "code": code,
    "options": options,
    "compiler": compiler,
    "stdin": input,
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

  try {
    const response = await fetch("https://wandbox.org/api/compile.json", requestOptions);
    return await response.text();
  } catch (error) {
    return console.log('error', error);
  }
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
  
  const handleCheckboxOptionChange = (event) => {
    if(event.target.checked)
      selectedOptions[event.target.value] = event.target.value;
    else
      delete selectedOptions[event.target.value];
  }
  return (
    <div>
      <SelectList name="language" handleChange={handleLanguageChange} list={Object.keys(props.languageCompilerMap)} />
      <SelectList name="compiler" handleChange={handleCompilerChange} list={props.languageCompilerMap[language]} />
      {
        props.compilerOptionsMap[compiler].map(option => {
          if(option.type == 'select')
            return (
              <SelectListAPI name={option.name} handleChange={handleOptionChange(option.name)} list={option.options} />
            )
        })
      }
      <FormGroup>
        {
          props.compilerOptionsMap[compiler].map(option => {
            if(option.type == 'single') 
              return (
                <FormControlLabel control={<Checkbox value={option['name']} onChange={handleCheckboxOptionChange} />} label={option['display-name']} />
              )
          })
        }
      </FormGroup>
      {/* <Button variant="contained" onClick={() => }>Run</Button> */}
      <div>
        {props.task.tests.map((test, index) => {
          const [inputValue, setInputValue] = useLocalStorage(`testcaseinput${index}`, test.input);
          const [outputValue, setOutputValue] = useLocalStorage(`testcaseoutput${index}`, test.output);
          const [compilerOutput, setCompilerOutput] = useState('');
          useEffect(() => {
            setCompilerOutput(runCode(props.editorValue, inputValue, compiler, selectedOptions))
          }, [])
          // console.log(runCode(props.editorValue, inputValue, compiler, selectedOptions))
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
                <MonacoDiffEditor value={outputValue} setValue={setOutputValue} secondValue={compilerOutput} />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}
