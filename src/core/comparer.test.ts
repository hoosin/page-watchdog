import { haveScriptsChanged } from './comparer';

describe('haveScriptsChanged', () => {
  const scriptA = '<script src="a.js"></script>';
  const scriptB = '<script src="b.js"></script>';
  const scriptC = '<script src="c.js"></script>';
  const scriptA_modified = '<script src="a.js?v=2"></script>';

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
});
