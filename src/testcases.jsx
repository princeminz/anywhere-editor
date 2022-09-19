import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import MonacoEditor from "./editor";
import task from "./ccparser";
import useLocalStorage from "./useLocalStorage";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// need a more robust size calculation for test case editors
export default function Testcases(props) {
  const [language, setLanguage] = useState('');
  const [compiler, setCompiler] = useState('');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCompilerChange = (event) => {
    setCompiler(event.target.value);
  };
  
  return (
    <div>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
        >
          {
            Object.keys(props.languageCompilerMap).map(lang => {
              return <MenuItem value={lang} key={lang} >{lang}</MenuItem>
            })
          }
        </Select>
      </FormControl>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="compiler-select-label">Compiler</InputLabel>
        <Select
          labelId="compiler-select-label"
          id="compiler-select"
          value={compiler}
          onChange={handleCompilerChange}
        >
          {
            props.languageCompilerMap[language].map(compiler => {
              return <MenuItem value={compiler} key={compiler} >{compiler}</MenuItem>
            })
          }
        </Select>
      </FormControl>
      {/* {
        props.compilerOptionsMap[compiler].map(sw => {
          if(sw == 'select')
            return (
              <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id={sw.name+'label'}>Compiler</InputLabel>
                <Select
                  labelId={sw.name+'label'}
                  id={sw.name}
                  // value={compiler}
                  // onChange={handleCompilerChange}
                  defaultValue={sw.default}
                >
                  {
                    sw.options.map(option => {
                      return <MenuItem value={option.name} key={option.name} >{option['display-name']}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            )
        })
      } */}
      <FormGroup>
        {
          props.compilerOptionsMap[compiler].map(option => {
            if(option.type == 'single') 
              return <FormControlLabel control={<Checkbox />} label={option['display-name']} />
          })
        }
      </FormGroup>
      
      <div>
        {task.tests.map((test, index) => {
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
