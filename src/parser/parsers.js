import { CodeforcesProblemParser } from "./problem/CodeforcesProblemParser";
import { CSESProblemParser } from "./problem/CSESProblemParser";

export const parsers = [
  new CodeforcesProblemParser(),
  new CSESProblemParser(),
];
