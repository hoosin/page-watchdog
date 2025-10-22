import { parseScripts } from './parser';

describe('parseScripts', () => {
  it('should return an empty array for an empty string', () => {
    expect(parseScripts('')).toEqual([]);
  });

  it('should return an empty array if no script tags are present', () => {
    const html = '<html><head></head><body><p>Hello</p></body></html>';
    expect(parseScripts(html)).toEqual([]);
  });

  it('should extract a single simple script tag', () => {
    const html = '<script src="app.js"></script>';
    expect(parseScripts(html)).toEqual([html]);
  });

  it('should extract multiple script tags', () => {
    const html = `
      <script src="a.js"></script>
      <p>Some text</p>
      <script src="b.js"></script>
    `;
    const expected = [
      '<script src="a.js"></script>',
      '<script src="b.js"></script>'
    ];
    // The regex might capture surrounding whitespace, so we trim for a stable comparison.
    const result = parseScripts(html).map(s => s.trim());
    expect(result).toEqual(expected);
  });

  it('should extract script tags with attributes', () => {
    const script = '<script type="module" src="main.js" async defer></script>';
    expect(parseScripts(script)).toEqual([script]);
  });

  it('should extract inline scripts', () => {
    const script = '<script>console.log("hello");</script>';
    expect(parseScripts(script)).toEqual([script]);
  });

  it('should handle a mix of inline and external scripts', () => {
    const html = `
      <script src="a.js"></script>
      <script>window.DATA = { id: 1 };</script>
    `;
    const expected = [
      '<script src="a.js"></script>',
      '<script>window.DATA = { id: 1 };</script>'
    ];
    const result = parseScripts(html).map(s => s.trim());
    expect(result).toEqual(expected);
  });

  it('should not match script tags within comments', () => {
    const html = '<!-- <script src="commented.js"></script> -->';
    expect(parseScripts(html)).toEqual([]);
  });
});
