/**
 * Compares two arrays of script tag strings to see if they have changed.
 * This is a simple but effective check for changes, additions, or removals.
 * @param oldScripts The array of script tags from the previous check.
 * @param newScripts The array of script tags from the current check.
 * @returns `true` if the scripts have changed, `false` otherwise.
 */
export function haveScriptsChanged(oldScripts: string[], newScripts: string[]): boolean {
  if (oldScripts.length !== newScripts.length) {
    return true;
  }

  const oldSet = new Set(oldScripts);
  const newSet = new Set(newScripts);

  // Check if any script from the old set is missing in the new set.
  // This covers removals and modifications (since a modified script is a new string).
  for (const script of oldSet) {
    if (!newSet.has(script)) {
      return true;
    }
  }

  return false;
}
