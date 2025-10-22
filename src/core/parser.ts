/**
 * A regular expression to find and remove all HTML comments.
 * The `s` flag allows `.` to match newline characters, handling multi-line comments.
 */
const HTML_COMMENT_REGEX = /<!--.*?-->/gs;

/**
 * A regular expression to find all script tags in an HTML string.
 */
const SCRIPT_TAG_REGEX = /<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/ig;

/**
 * Parses an HTML string and extracts all script tags.
 * It first removes HTML comments to avoid matching commented-out scripts.
 * @param html The HTML string to parse.
 * @returns An array of strings, where each string is a full script tag.
 */
export function parseScripts(html: string): string[] {
  // First, remove all comments from the HTML string to prevent matching commented-out scripts.
  const htmlWithoutComments = html.replace(HTML_COMMENT_REGEX, '');

  // Reset regex state for subsequent calls before using it.
  SCRIPT_TAG_REGEX.lastIndex = 0;
  return htmlWithoutComments.match(SCRIPT_TAG_REGEX) || [];
}
