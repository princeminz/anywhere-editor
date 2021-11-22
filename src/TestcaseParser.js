import { Parser } from "./parser/Parser.js";
import { parsers } from "./parser/parsers.js";

function getParserToUse() {
  const url = window.location.href;

  for (const parser of parsers) {
    const hasMatchingPattern = parser
      .getRegularExpressions()
      .some((r) => r.test(url));
    const hasMatchingExcludedPattern = parser
      .getExcludedRegularExpressions()
      .some((r) => r.test(url));

    if (
      hasMatchingPattern &&
      !hasMatchingExcludedPattern &&
      parser.canHandlePage()
    ) {
      return parser;
    }
  }

  return null;
}

function parse(parser) {
  return parser.parse(window.location.href, document.documentElement.outerHTML);
}

function submit(parser, source_code) {
  parser.submit(window.location.href, source_code);
}

export { parse, getParserToUse, submit };
