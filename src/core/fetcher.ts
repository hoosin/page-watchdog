/**
 * Fetches the content from a given endpoint.
 * Assumes the base URL is the current origin.
 * @param disableCache Determines whether to disable browser caching. If not `false`, a timestamp is added to the URL.
 * @returns A promise that resolves with the content as a string.
 * @throws An error if the fetch operation fails.
 */
export async function fetchEndpoint(disableCache?: boolean): Promise<string> {
  let url = '/';

  // Caching is only allowed when `disableCache` is explicitly set to `false`.
  if (disableCache !== false) {
    url += `?_=${new Date().getTime()}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch endpoint: ${response.statusText}`);
  }
  return response.text();
}
