import { parsers } from "../competitive-companion/src/parsers/parsers";

let task = null;

const url = window.location.href;

for (const parser of parsers) {
  const hasMatchingPattern = parser.getRegularExpressions().some((r) =>
    r.test(url)
  );
  const hasMatchingExcludedPattern = parser.getExcludedRegularExpressions()
    .some((r) => r.test(url));

  if (
    hasMatchingPattern && !hasMatchingExcludedPattern && parser.canHandlePage()
  ) {
    task = await parser.parse(
      url,
      document.documentElement.outerHTML,
    );
  }
}

export default task;
