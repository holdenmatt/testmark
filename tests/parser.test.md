# mdtest Parser Tests

Tests for the mdtest parser that extracts test cases from markdown files.

## tldr

- **Basic parsing**: single test, multiple tests, error cases
- **Whitespace handling**: multiline content, no trimming, empty strings
- **Edge cases**: code fences, nested headings, aliases
- **Error cases**: invalid inputs that should cause parser to exit with error

## Note

We use the shorter aliases (i, o, e tags) in the examples being parsed to distinguish them from the outer input/output tags used by mdtest itself.

## Basic Parsing

### Single Test Case
Extracts a simple input/output pair.

<input>
### Test Name
<i>hello</i>
<o>world</o>
</input>

<output>
{
  "tests": [
    {
      "name": "Test Name",
      "input": "hello",
      "output": "world"
    }
  ]
}
</output>

### Multiple Test Cases
Extracts multiple tests from one file.

<input>
### First Test
<i>a</i>
<o>b</o>

### Second Test
<i>c</i>
<o>d</o>
</input>

<output>
{
  "tests": [
    {
      "name": "First Test",
      "input": "a",
      "output": "b"
    },
    {
      "name": "Second Test",
      "input": "c",
      "output": "d"
    }
  ]
}
</output>

### Error Test Case
Parses error expectations instead of output.

<input>
### Error Test
<i>bad input</i>
<e>Invalid input</e>
</input>

<output>
{
  "tests": [
    {
      "name": "Error Test",
      "input": "bad input",
      "error": "Invalid input"
    }
  ]
}
</output>

### Test With Aliases
Parser supports both full tags and aliases.

<input>
### Full Tags
<input>hello</input>
<output>world</output>

### Short Tags
<i>foo</i>
<o>bar</o>
</input>

<output>
{
  "tests": [
    {
      "name": "Full Tags",
      "input": "hello",
      "output": "world"
    },
    {
      "name": "Short Tags",
      "input": "foo",
      "output": "bar"
    }
  ]
}
</output>

## Whitespace Handling

### No Trimming
Content is extracted exactly as written (no trim).

<input>
### Spaces Test
<i>  spaces before and after  </i>
<o>  preserved  </o>
</input>

<output>
{
  "tests": [
    {
      "name": "Spaces Test",
      "input": "  spaces before and after  ",
      "output": "  preserved  "
    }
  ]
}
</output>

### Preserves Newlines
Multiline content preserves newlines as \n.

<input>
### Multiline Test
<i>line 1
line 2
line 3</i>
<o>result 1
result 2</o>
</input>

<output>
{
  "tests": [
    {
      "name": "Multiline Test",
      "input": "line 1\nline 2\nline 3",
      "output": "result 1\nresult 2"
    }
  ]
}
</output>

### Empty Tags
Empty tags result in empty strings.

<input>
### Empty Test
<i></i>
<o></o>
</input>

<output>
{
  "tests": [
    {
      "name": "Empty Test",
      "input": "",
      "output": ""
    }
  ]
}
</output>

## Edge Cases

### Code Fences Ignored
Code fences are ignored during parsing.

<input>
### With Code Fence
```
<i>hello</i>
```
```
<o>world</o>
```
</input>

<output>
{
  "tests": [
    {
      "name": "With Code Fence",
      "input": "hello",
      "output": "world"
    }
  ]
}
</output>

### Nested Headings
Uses immediate heading above tags as test name.

<input>
## Category

### Specific Test
<i>foo</i>
<o>bar</o>
</input>

<output>
{
  "tests": [
    {
      "name": "Specific Test",
      "input": "foo",
      "output": "bar"
    }
  ]
}
</output>

### Documentation Sections
Sections without tags are ignored (documentation).

<input>
## Documentation Section
This is just documentation, no test here.

### Valid Test
<i>test</i>
<o>result</o>

## Another Doc Section
More documentation without tags.
</input>

<output>
{
  "tests": [
    {
      "name": "Valid Test",
      "input": "test",
      "output": "result"
    }
  ]
}
</output>

### Unicode and Emoji
Unicode and emoji pass through unchanged.

<input>
### Unicode Test
<i>Hello 世界 🌍</i>
<o>你好 World 🎉</o>
</input>

<output>
{
  "tests": [
    {
      "name": "Unicode Test",
      "input": "Hello 世界 🌍",
      "output": "你好 World 🎉"
    }
  ]
}
</output>

## Error Cases

### Missing Output
Parser exits with error when input has no output/error.

<input>
### Incomplete Test
<i>hello</i>
</input>

<error>Invalid test "Incomplete Test": has input but no output or error</error>

### Both Output and Error
Parser exits with error when both output and error present.

<input>
### Invalid Test
<i>x</i>
<o>y</o>
<e>z</e>
</input>

<error>Invalid test "Invalid Test": cannot have both output and error</error>

### No Heading
Parser exits with error when tags have no heading.

<input>
<i>no heading</i>
<o>result</o>
</input>

<error>Invalid test: tags found but no heading</error>

### Multiple Input Tags
Parser exits with error on multiple input tags.

<input>
### Multiple Inputs
<i>first</i>
<i>second</i>
<o>output</o>
</input>

<error>Invalid test "Multiple Inputs": multiple input tags found</error>

### Unclosed Tags
Parser exits with error on unclosed tags.

<input>
### Unclosed Tag
<i>hello
<o>world</o>
</input>

<error>Invalid test "Unclosed Tag": unclosed input tag</error>

### Output Without Input
Parser exits with error when output/error has no input.

<input>
### No Input
<o>output only</o>
</input>

<error>Invalid test "No Input": has output but no input</error>