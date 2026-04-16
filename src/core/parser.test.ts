import { parseResources } from './parser';

describe('parseResources', () => {
  // Script tags
  it('should return an empty array for an empty string', () => {
    expect(parseResources('')).toEqual([]);
  });

  it('should return an empty array if no script or stylesheet tags are present', () => {
    const html = '<html><head></head><body><p>Hello</p></body></html>';
    expect(parseResources(html)).toEqual([]);
  });

  it('should extract a single simple script tag', () => {
    const html = '<script src="app.js"></script>';
    expect(parseResources(html)).toEqual([html]);
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
    const result = parseResources(html).map(s => s.trim());
    expect(result).toEqual(expected);
  });

  it('should extract script tags with attributes', () => {
    const script = '<script type="module" src="main.js" async defer></script>';
    expect(parseResources(script)).toEqual([script]);
  });

  it('should extract inline scripts', () => {
    const script = '<script>console.log("hello");</script>';
    expect(parseResources(script)).toEqual([script]);
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
    const result = parseResources(html).map(s => s.trim());
    expect(result).toEqual(expected);
  });

  it('should extract multiline inline scripts', () => {
    const script = `<script>
  var config = {
    apiKey: "xxx"
  };
</script>`;
    const result = parseResources(script);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('var config');
  });

  it('should not match script tags within comments', () => {
    const html = '<!-- <script src="commented.js"></script> -->';
    expect(parseResources(html)).toEqual([]);
  });

  // Stylesheet link tags
  it('should extract a stylesheet link tag', () => {
    const html = '<link rel="stylesheet" href="style.css">';
    expect(parseResources(html)).toEqual([html]);
  });

  it('should extract a stylesheet link tag with rel after href', () => {
    const html = '<link href="style.css" rel="stylesheet">';
    expect(parseResources(html)).toEqual([html]);
  });

  it('should extract self-closing stylesheet link tags', () => {
    const html = '<link rel="stylesheet" href="style.css" />';
    expect(parseResources(html)).toEqual([html]);
  });

  it('should not match non-stylesheet link tags', () => {
    const html = '<link rel="icon" href="favicon.ico">';
    expect(parseResources(html)).toEqual([]);
  });

  it('should not match stylesheet link tags within comments', () => {
    const html = '<!-- <link rel="stylesheet" href="old.css"> -->';
    expect(parseResources(html)).toEqual([]);
  });

  it('should extract both scripts and stylesheets', () => {
    const html = `
      <link rel="stylesheet" href="app.abc123.css">
      <script src="app.abc123.js"></script>
    `;
    const result = parseResources(html).map(s => s.trim());
    expect(result).toEqual([
      '<script src="app.abc123.js"></script>',
      '<link rel="stylesheet" href="app.abc123.css">',
    ]);
  });
});
