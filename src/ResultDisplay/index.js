import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Slide from "@mui/material/Slide";
import { useAppState, useActions } from "../store";
import CircularProgress from "@mui/material/CircularProgress";
import TestcaseComponent from "./testcasecomponent";
import Skeleton from "@mui/material/Skeleton";
export default function Block() {
  const state = useAppState();
  const actions = useActions();
  const containerRef = React.useRef(null);

  function hideResult() {
    actions.hideResult();
  }

  return (
    <div
      style={{
        flexGrow: 2,
        width: "100%",
        height: "40vh",
        display: state.isResultDisplayed ? "flex" : "none",
        flexFlow: "column",
      }}
    >
      <Box sx={{ flexGrow: 1, boxShadow: 50 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Results
            </Typography>
            <IconButton onClick={hideResult} color="inherit">
              <KeyboardArrowDownIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>

      <Box
        component="div"
        sx={{
          p: 1,
          bgcolor: "background.paper",
          flexGrow: 5,
          overflow: "auto",
          display: "flex",
          flexFlow: "column",
        }}
      >
        {state.isResultFetched
          ? state.resultData.submissions.map((submission, index) => (
              <TestcaseComponent
                key={index}
                input={submission.stdin}
                output={
                  submission.stderr == null
                    ? submission.stdout
                    : submission.stderr
                }
                status={submission.status}
              />
            ))
          : Array(3)
              .fill()
              .map((element, index) => (
                <Skeleton
                  animation="wave"
                  key={index}
                  sx={{
                    height: "5vh",
                    width: "70%",
                    margin: "0 auto",
                    borderRadius: "20px",
                  }}
                />
              ))}
      </Box>
    </div>
  );
}
