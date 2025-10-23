/**
 * Fetches the HTML content of the current page.
 * Assumes the base URL is the current origin.
 * @param disableCache Determines whether to disable browser caching. If not `false`, a timestamp is added to the URL.
 * @returns A promise that resolves with the HTML content as a string.
 * @throws An error if the fetch operation fails.
 */
export async function getHtml(disableCache?: boolean): Promise<string> {
  let url = '/';

  // Caching is only allowed when `disableCache` is explicitly set to `false`.
  if (disableCache !== false) {
    url += `?_=${new Date().getTime()}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch HTML: ${response.statusText}`);
  }
  return response.text();
}
