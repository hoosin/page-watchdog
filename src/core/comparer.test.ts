import { haveScriptsChanged } from './comparer';

describe('haveScriptsChanged', () => {
  const scriptA = '<script src="a.js"></script>';
  const scriptB = '<script src="b.js"></script>';
  const scriptC = '<script src="c.js"></script>';
  const scriptD = '<script src="d.js"></script>';
  const scriptA_modified = '<script src="a.js?v=2"></script>';
  const scriptB_modified = '<script src="b.js?v=2"></script>';

  it('should return false for identical, non-empty arrays', () => {
    const oldScripts = [scriptA, scriptB];
    const newScripts = [scriptA, scriptB];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(false);
  });

  it('should return false for two empty arrays', () => {
    expect(haveScriptsChanged([], [])).toBe(false);
  });

  it('should return true if a script is added', () => {
    const oldScripts = [scriptA, scriptB];
    const newScripts = [scriptA, scriptB, scriptC];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return true if a script is removed', () => {
    const oldScripts = [scriptA, scriptB, scriptC];
    const newScripts = [scriptA, scriptB];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return true if a script is modified (content change)', () => {
    const oldScripts = [scriptA, scriptB];
    const newScripts = [scriptA_modified, scriptB]; // scriptA is modified
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return true if scripts are completely different', () => {
    const oldScripts = [scriptA, scriptB];
    const newScripts = [scriptC, scriptA_modified];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return false for identical arrays with different order (Set comparison handles this)', () => {
    const oldScripts = [scriptA, scriptB];
    const newScripts = [scriptB, scriptA];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(false);
  });

  it('should return true when the new array is empty and the old one was not', () => {
    const oldScripts = [scriptA];
    const newScripts: string[] = [];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return true when the old array was empty and the new one is not', () => {
    const oldScripts: string[] = [];
    const newScripts = [scriptA];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  // --- New Test Cases for Duplicates and Edge Cases ---

  it('should return false for identical arrays containing duplicates, same order', () => {
    const oldScripts = [scriptA, scriptB, scriptA];
    const newScripts = [scriptA, scriptB, scriptA];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(false);
  });

  it('should return false for identical arrays containing duplicates, different order', () => {
    const oldScripts = [scriptA, scriptB, scriptA];
    const newScripts = [scriptB, scriptA, scriptA];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(false);
  });

  it('should return true if a unique script is added in an array with duplicates', () => {
    const oldScripts = [scriptA, scriptB, scriptA];
    const newScripts = [scriptA, scriptB, scriptC, scriptA]; // C added
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return true if a unique script is removed from an array with duplicates', () => {
    const oldScripts = [scriptA, scriptB, scriptC, scriptA];
    const newScripts = [scriptA, scriptB, scriptA]; // C removed
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return true if a duplicate script is replaced by a new unique script (same length)', () => {
    const oldScripts = [scriptA, scriptB, scriptA]; // Unique: A, B
    const newScripts = [scriptA, scriptB, scriptC]; // Unique: A, B, C
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return true if a unique script is replaced by a duplicate of another existing script (same length)', () => {
    const oldScripts = [scriptA, scriptB, scriptC]; // Unique: A, B, C
    const newScripts = [scriptA, scriptB, scriptA]; // Unique: A, B
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return true if all scripts are modified (same length)', () => {
    const oldScripts = [scriptA, scriptB];
    const newScripts = [scriptA_modified, scriptB_modified];
    expect(haveScriptsChanged(oldScripts, newScripts)).toBe(true);
  });

  it('should return false for large identical arrays', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => `<script src="script${i}.js"></script>`);
    expect(haveScriptsChanged(largeArray, [...largeArray])).toBe(false);
  });

  it('should return true for large arrays with one script modified', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => `<script src="script${i}.js"></script>`);
    const modifiedArray = [...largeArray];
    modifiedArray[500] = '<script src="script500_modified.js"></script>';
    expect(haveScriptsChanged(largeArray, modifiedArray)).toBe(true);
  });
});
