import { fontSize, height } from "@mui/system";
import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import Divider from "@mui/material/Divider";

const TestcaseComponent = function (props) {
  const Item = styled("div")({
    color: "darkslategray",
    color: props.status.id > 4 ? "#EB1111" : "#000000",
    backgroundColor: "aliceblue",
    padding: 8,
    borderRadius: 4,
    width: "auto",
    fontSize: "1.2rem",
    fontFamily: "Consolas",
  });
  const ItemLabel = styled("div")({
    textAlign: "center",
    fontSize: "1.5rem",
  });
  const ItemStatus = styled("div")({
    fontSize: "1.3rem",
    color: props.status.id == 3 ? "#11EB3C" : "#EB1111",
    fontWeight: "bold",
  });

  const input = props.input.split("\n").map((str, index) => (
    <span key={index}>
      {str}
      <br />
    </span>
  ));

  const output = props.output
    ? props.output.split("\n").map((str, index) => (
        <span key={index}>
          {str}
          <br />
        </span>
      ))
    : "";

  return (
    <Box sx={{ flexGrow: 1, margin: "2vh 0" }}>
      <Grid container rowSpacing={1} columnSpacing={3}>
        <Grid item xs={3}>
          <ItemLabel>Input</ItemLabel>
        </Grid>
        <Grid item xs={8}>
          <Item sx={{ color: "black" }}>{input}</Item>
        </Grid>
        <Grid item xs={3}>
          <ItemLabel>Output</ItemLabel>
        </Grid>
        <Grid item xs={8}>
          <Item>{output}</Item>
        </Grid>
        <Grid item xs={3}>
          <ItemLabel>Status</ItemLabel>
        </Grid>
        <Grid item xs={8}>
          <ItemStatus>{props.status.description}</ItemStatus>
        </Grid>
      </Grid>
      <Divider sx={{ height: "5px" }} />
    </Box>
  );
};

export default TestcaseComponent;
