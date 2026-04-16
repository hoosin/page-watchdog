/**
 * A regular expression to find and remove all HTML comments.
 * The `s` flag allows `.` to match newline characters, handling multi-line comments.
 */
const HTML_COMMENT_REGEX = /<!--.*?-->/gs;

/**
 * A regular expression to find all script tags in an HTML string.
 */
const SCRIPT_TAG_REGEX = /<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/igs;

/**
 * A regular expression to find all stylesheet link tags in an HTML string.
 * Matches `<link>` tags that contain `rel="stylesheet"` (or `rel='stylesheet'`).
 */
const LINK_STYLESHEET_REGEX = /<link\s[^>]*rel\s*=\s*["']stylesheet["'][^>]*\/?>/ig;

/**
 * Parses an HTML string and extracts all script tags and stylesheet link tags.
 * It first removes HTML comments to avoid matching commented-out resources.
 * @param html The HTML string to parse.
 * @returns An array of strings, where each string is a full script or link tag.
 */
export function parseResources(html: string): string[] {
  // First, remove all comments from the HTML string to prevent matching commented-out resources.
  const htmlWithoutComments = html.replace(HTML_COMMENT_REGEX, '');

  // Reset regex state for subsequent calls before using it.
  SCRIPT_TAG_REGEX.lastIndex = 0;
  LINK_STYLESHEET_REGEX.lastIndex = 0;

  const scripts = htmlWithoutComments.match(SCRIPT_TAG_REGEX) || [];
  const stylesheets = htmlWithoutComments.match(LINK_STYLESHEET_REGEX) || [];

  return [...scripts, ...stylesheets];
}
