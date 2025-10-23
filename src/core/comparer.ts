/**
 * Compares two arrays of script tag strings to see if the set of unique scripts has changed.
 * This function checks for additions, removals, or modifications of unique scripts, ignoring order and duplicates.
 * @param oldScripts The array of script tags from the previous check.
 * @param newScripts The array of script tags from the current check.
 * @returns `true` if the set of unique scripts has changed, `false` otherwise.
 */
export function areScriptsChanged(oldScripts: string[], newScripts: string[]): boolean {
  const oldSet = new Set(oldScripts);
  const newSet = new Set(newScripts);

  // 1. If the number of unique scripts is different, the set has changed.
  if (oldSet.size !== newSet.size) {
    return true;
  }

  // 2. If the sizes are the same, check if every script in the old set exists in the new set.
  //    Since the sizes are equal, this is sufficient to prove set equality.
  for (const script of oldSet) {
    if (!newSet.has(script)) {
      return true;
    }
  }

  // If sizes are equal and all elements of oldSet are in newSet, the sets are identical.
  return false;
}
