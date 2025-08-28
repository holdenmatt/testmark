# Parser Spec

Technical details for implementing the mdtest parser.

## Algorithm

- Split markdown by headings (any level)
- Process each section for valid test cases
- Raw text parsing (no AST/markdown parser needed)
- Non-greedy regex for tag contents

## Valid Test

- Heading text (becomes test name)
- One `<input>` or `<i>` tag
- One `<output>`/`<o>` OR `<error>`/`<e>` tag
- Case-sensitive lowercase tags
- Aliases: `<i>`, `<o>`, `<e>`

## Content

- Extract tag content exactly (no trim)
- Empty tags → empty strings
- Preserve newlines as `\n`
- Pass through unicode/emoji unchanged

## Error Cases

Parser exits with error on:
- Tags without heading
- Input without output/error
- Output/error without input
- Both output AND error
- Multiple same tags
- Unclosed tags

## Ignore Silently

- Sections without tags (documentation)
- Code fences around tags

## Output

```json
{
  "tests": [{
    "name": "heading text",
    "input": "content",
    "output": "content",  // OR
    "error": "message"    // (exclusive)
  }]
}
```

Empty test array if no valid tests (not an error).