# Slugify Tests

**tldr**: Tests for a URL slug generator that converts text to lowercase, kebab-case strings.

## Basic Cases

### Lowercase and Spaces
<input>Hello World</input>
<output>hello-world</output>

### Special Characters
<input>It's amazing!</input>
<output>its-amazing</output>

### Multiple Spaces
<input>Too    many     spaces</input>
<output>too-many-spaces</output>

### Numbers
<input>Version 2.0 Released</input>
<output>version-20-released</output>

## Edge Cases

### Leading/Trailing Spaces
<input>  trimmed  </input>
<output>trimmed</output>

### Only Special Characters
<input>!@#$%</input>
<output></output>

### Unicode
<input>Hello 世界</input>
<output>hello</output>

### Empty String
<input></input>
<error>Input cannot be empty</error>