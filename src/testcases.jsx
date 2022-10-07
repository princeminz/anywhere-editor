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
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

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
const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];


// need a more robust size calculation for test case editors
export default function Testcases(props) {
  const [language, setLanguage] = useState('');
  const [compiler, setCompiler] = useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
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
  

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {[
          <React.Fragment>
              <SelectList name="language" handleChange={handleLanguageChange} list={Object.keys(props.languageCompilerMap)} />
          </React.Fragment>,
          <React.Fragment>
              <SelectList name="compiler" handleChange={handleCompilerChange} list={props.languageCompilerMap[language]} />
          </React.Fragment>,
          <React.Fragment>
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
          </React.Fragment>
        ][activeStep]}
        
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
          Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}

          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    
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
