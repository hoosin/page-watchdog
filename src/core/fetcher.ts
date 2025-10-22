/**
 * Fetches the HTML content of the current page.
 * Assumes the base URL is the current origin.
 * @returns A promise that resolves with the HTML content as a string.
 * @throws An error if the fetch operation fails.
 */
export async function getHtml(): Promise<string> {
  const response = await fetch('/');
  if (!response.ok) {
    throw new Error(`Failed to fetch HTML: ${response.statusText}`);
  }
  return response.text();
}
