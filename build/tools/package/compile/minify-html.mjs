import { minify } from 'html-minifier-terser';


const DEFAULT_HTML_MINIFIER_OPTIONS = {
  caseSensitive: true,
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  conservativeCollapse: false,
  continueOnParseError: true,
  removeComments: true,
  sortAttributes: true,
  sortClassName: true,
  keepClosingSlash: true,
};

export function minifyHtml(
  code,
  options = DEFAULT_HTML_MINIFIER_OPTIONS,
) {
  return minify(code, options);
}
