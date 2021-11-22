import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
// import typescript from '@rollup/plugin-typescript';
import json from "@rollup/plugin-json";

export default [
  {
    input: "src/content.js",
    output: {
      file: "build/content.js",
      format: "iife",
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        extensions: [".js"],
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
      babel({
        presets: ["@babel/preset-react"],
      }),
      commonjs(),
    ],
  },
  {
    input: "src/App.js",
    output: {
      file: "build/App.js",
      format: "iife",
      sourcemap: true,
    },
    plugins: [
      // typescript(),
      json(),
      nodeResolve({
        extensions: [".js", ".ts"],
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development"),
        "process.env.DRAGGABLE_DEBUG": false,
      }),
      babel({
        presets: ["@babel/preset-react"],
      }),
      commonjs(),
    ],
  },
];
