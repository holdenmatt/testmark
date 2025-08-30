import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '../src/parser.js';

describe('Parser - Simple Cases', () => {
  it('should parse a basic test case', () => {
    const input = `### My Test
<input>hello</input>
<output>world</output>`;

    const result = parseMarkdown(input);
    expect(result.tests).toHaveLength(1);
    expect(result.tests[0]).toEqual({
      name: 'My Test',
      input: 'hello',
      output: 'world',
    });
  });

  it('should parse error test cases', () => {
    const input = `### Error Test
<input>bad</input>
<error>Something went wrong</error>`;

    const result = parseMarkdown(input);
    expect(result.tests).toHaveLength(1);
    expect(result.tests[0]).toEqual({
      name: 'Error Test',
      input: 'bad',
      error: 'Something went wrong',
    });
  });

  it('should skip documentation sections', () => {
    const input = `## Documentation
This is just docs.

### Actual Test
<input>foo</input>
<output>bar</output>

## More Docs
No tests here either.`;

    const result = parseMarkdown(input);
    expect(result.tests).toHaveLength(1);
    expect(result.tests[0].name).toBe('Actual Test');
  });

  it('should handle empty tags', () => {
    const input = `### Empty Test
<input></input>
<output></output>`;

    const result = parseMarkdown(input);
    expect(result.tests).toHaveLength(1);
    expect(result.tests[0]).toEqual({
      name: 'Empty Test',
      input: '',
      output: '',
    });
  });

  it('should preserve whitespace', () => {
    const input = `### Whitespace Test
<input>  spaces  </input>
<output>  preserved  </output>`;

    const result = parseMarkdown(input);
    expect(result.tests[0]).toEqual({
      name: 'Whitespace Test',
      input: '  spaces  ',
      output: '  preserved  ',
    });
  });

  it('should preserve newlines', () => {
    const input = `### Multiline
<input>line1
line2</input>
<output>result1
result2</output>`;

    const result = parseMarkdown(input);
    expect(result.tests[0]).toEqual({
      name: 'Multiline',
      input: 'line1\nline2',
      output: 'result1\nresult2',
    });
  });

  it('should block-trim one surrounding newline inside tags', () => {
    const input = `### Trim
<input>
foo
</input>
<output>
bar
</output>`;

    const result = parseMarkdown(input);
    expect(result.tests).toHaveLength(1);
    expect(result.tests[0]).toEqual({
      name: 'Trim',
      input: 'foo',
      output: 'bar',
    });
  });

  it('should preserve additional blank lines beyond the boundary', () => {
    const input = `### Extra Newlines
<input>

foo

</input>
<output>

bar
</output>`;

    const result = parseMarkdown(input);
    expect(result.tests[0]).toEqual({
      name: 'Extra Newlines',
      input: '\nfoo\n',
      output: '\nbar',
    });
  });

  describe('Files fixtures', () => {
    it('should capture a single <file> with block-trim and EOL normalization', () => {
      const md = `### Uses File\n<file name="a.md">\nHello\r\nWorld\n</file>\n<input>ok</input>\n<output>ok</output>`;
      const result = parseMarkdown(md);
      expect(result.tests).toHaveLength(1);
      const files = (
        result.tests[0] as unknown as {
          files?: Record<string, string>;
        }
      ).files;
      expect(files).toBeDefined();
      expect(files).toEqual({ 'a.md': 'Hello\nWorld' });
    });

    it('should capture multiple unique files', () => {
      const md = `### Two Files\n<file name="a.md">A</file>\n<file name="b.txt">B</file>\n<input>x</input>\n<output>y</output>`;
      const result = parseMarkdown(md);
      const files = (
        result.tests[0] as unknown as {
          files?: Record<string, string>;
        }
      ).files;
      expect(files).toEqual({ 'a.md': 'A', 'b.txt': 'B' });
    });

    it('should error on duplicate file names within a test', () => {
      const md = `### Dup\n<file name="a.md">1</file>\n<file name="a.md">2</file>\n<input>x</input>\n<output>y</output>`;
      expect(() => parseMarkdown(md)).toThrow('duplicate');
    });

    it('should error on unclosed <file> tag', () => {
      const md = `### Bad File\n<file name="a.md">oops\n<input>x</input>\n<output>y</output>`;
      expect(() => parseMarkdown(md)).toThrow('unclosed');
    });
  });
  it('should normalize CRLF line endings and then block-trim', () => {
    const input =
      '### CRLF Test\r\n<input>\r\nhello\r\n</input>\r\n<output>\r\nworld\r\n</output>';
    const result = parseMarkdown(input);
    expect(result.tests[0]).toEqual({
      name: 'CRLF Test',
      input: 'hello',
      output: 'world',
    });
  });

  it('should throw on missing output', () => {
    const input = `### Bad Test
<input>hello</input>`;

    expect(() => parseMarkdown(input)).toThrow(
      'has input but no output or error'
    );
  });

  it('should throw on missing input', () => {
    const input = `### Bad Test
<output>hello</output>`;

    expect(() => parseMarkdown(input)).toThrow('has output but no input');
  });

  it('should throw on both output and error', () => {
    const input = `### Bad Test
<input>x</input>
<output>y</output>
<error>z</error>`;

    expect(() => parseMarkdown(input)).toThrow(
      'cannot have both output and error'
    );
  });

  it('should parse multiple tests in one file', () => {
    const input = `### First Test
<input>a</input>
<output>b</output>

### Second Test
<input>c</input>
<output>d</output>`;

    const result = parseMarkdown(input);
    expect(result.tests).toHaveLength(2);
    expect(result.tests[0].name).toBe('First Test');
    expect(result.tests[1].name).toBe('Second Test');
  });

  it('should parse tags inside code fences', () => {
    const input = `### With Code Fence
\`\`\`
<input>hello</input>
\`\`\`
\`\`\`
<output>world</output>
\`\`\``;

    const result = parseMarkdown(input);
    expect(result.tests).toHaveLength(1);
    expect(result.tests[0]).toEqual({
      name: 'With Code Fence',
      input: 'hello',
      output: 'world',
    });
  });

  it('should handle unicode and emoji', () => {
    const input = `### Unicode Test
<input>Hello 世界 🌍</input>
<output>你好 World 🎉</output>`;

    const result = parseMarkdown(input);
    expect(result.tests[0]).toEqual({
      name: 'Unicode Test',
      input: 'Hello 世界 🌍',
      output: '你好 World 🎉',
    });
  });

  it('should throw on tags without heading', () => {
    const input = `<input>no heading</input>
<output>result</output>`;

    expect(() => parseMarkdown(input)).toThrow(
      'Invalid test: tags found before first heading'
    );
  });

  it('should throw on multiple input tags', () => {
    const input = `### Multiple Inputs
<input>first</input>
<input>second</input>
<output>output</output>`;

    expect(() => parseMarkdown(input)).toThrow('multiple input tags found');
  });

  it('should throw on unclosed tags', () => {
    const input = `### Unclosed Tag
<input>hello
<output>world</output>`;

    expect(() => parseMarkdown(input)).toThrow('unclosed input tag');
  });

  it('should ignore headings inside code fences', () => {
    const input = `### Before
<input>a</input>
<output>b</output>

~~~
### Fake Heading
~~~

### After
<input>c</input>
<output>d</output>`;

    const result = parseMarkdown(input);
    expect(result.tests).toHaveLength(2);
    expect(result.tests[0].name).toBe('Before');
    expect(result.tests[1].name).toBe('After');
  });
});
