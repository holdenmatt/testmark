# Parser Spec

## Algorithm

- Split markdown by headings (any level), ignoring headings inside fenced code blocks
- Process each section for valid test cases
- Raw text parsing (no AST/markdown parser needed)
- Non-greedy regex for tag contents
- Normalize line endings (CRLF → LF) once up front
- When splitting by headings, mask fenced code blocks and test tags: `<input>`, `<output>`, `<error>`, and `<file name="…">` so headings inside them are ignored

## Valid Test

- Heading text (becomes test name)
- One `<input>` tag
- One `<output>` OR `<error>` tag
- Zero or more `<file name="…">` tags; names must be unique per test (names may include `/`)
- Case-sensitive lowercase tags only

## Content

- Normalize EOL to LF
- Block-trim: remove exactly one leading and one trailing newline around tag content for `<input>`, `<output>`, `<error>`, and `<file>`; preserve all other whitespace
- Empty tags → empty strings
- Pass through unicode/emoji unchanged

Examples:

- `<input>\nfoo\n</input>` → `"foo"`
- `<input>\n\nfoo\n</input>` → `"\nfoo"`

## Error Cases

Parser exits with error on:
- Tags without heading
- Input without output/error
- Output/error without input
- Both output AND error
- Multiple same tags
- Unclosed tags
- Duplicate `<file name="…">` within the same test

## Ignore Silently

- Sections without tags (documentation)
- Code fences around tags
- Headings that appear inside code fences

## Output

```json
{
  "tests": [{
    "name": "heading text",
    "input": "content",
    "output": "content",  // OR
    "error": "message",   // (exclusive)
    "files": {            // zero or more per test
      "a.md": "Hello"
    }
  }]
}
```

Empty test array if no valid tests (not an error).
