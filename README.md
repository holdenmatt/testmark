# TestMark

Write unit tests in Markdown. Run them in any test framework (like `vitest` or `pytest`).

## What it does

TestMark lets you write test cases (for string -> string functions) as readable Markdown documentation that can also be executed as tests. Write your test cases once, run them across multiple languages or test frameworks.

Here's what a test file looks like:

```markdown
# Slugify Tests

## Basic Transformations

### Spaces to Dashes
Converts spaces to dashes and lowercases text.

<input>Hello World</input>
<output>hello-world</output>

### Remove Special Characters
Strips out punctuation and special characters.

<input>
It's amazing!
</input>
<output>
its-amazing
</output>

### Collapse Multiple Spaces
Multiple spaces become a single dash.

<input>Too    many     spaces</input>
<output>too-many-spaces</output>
```

This is both documentation and an executable test suite. The same file can be a single source of truth for test cases across multiple languages.

The format is minimal by design:

- **Headings** organize and name your test cases
- A **test case** is any markdown section containing one `<input>` and one `<output>` tag
- **Code fences** are optional - they're ignored by the parser but improve readability on GitHub
- Headings that appear inside code fences are ignored (they don't start a new test section)
- **Everything else** is treated as documentation

The parser simply looks for markdown sections (delimited by headings) that contain `<input>` and `<output>` tags.

## Install

**TypeScript/JavaScript:**

```bash
npm install testmark
```

**Python:**

```bash
pip install testmark
# Requires Node.js and the testmark CLI installed globally: npm i -g testmark
```
The Python package provides a pytest adapter: `from testmark import testmark`.
It defers to the global `testmark` CLI for parsing.

## Quick Start

### Test Frameworks

The framework adapters parse your `.test.md` files and generate native test cases that your test runner executes and reports on.

#### Vitest

```typescript
import { testmark } from 'testmark/vitest';
import { slugify } from './slugify';

testmark('slugify.test.md', slugify);
```

#### Pytest

```python
from testmark import testmark
from slugify import slugify

testmark('slugify.test.md', slugify)
```

Your test runner will execute each test case from the markdown file, reporting passes and failures just like any other test.

### CLI Tool

There's also a CLI that parses test files to JSON:

```bash
# Parse test cases to JSON
testmark slugify.test.md

# Parse multiple files
testmark *.test.md
```

This can be useful for debugging or building custom tooling with Unix pipes.

## Errors

You can test that a function throws an error by using `<error>` instead of `<output>`:

```markdown
### Empty String
Should reject empty input.

<input></input>

<error>Input cannot be empty</error>
```

The test will pass if the function throws/raises an exception with that message.

## Whitespace

- Normalize EOL: convert CRLF to LF (i.e. "\n")
- Block-trim tags: for `<input>`, `<output>`, `<error>`, remove exactly one leading and one trailing newline if present; preserve all other whitespace.
- Authoring: tags can sit on their own lines; to assert boundary blank lines, include an extra blank line inside the tag.

Example:

```markdown
<input>
foo
</input>
```

Parses as `"foo"`.

## File Fixtures

Optional per-test `<file name="…">` tags can attach additional documents to a test. See `examples/files.test.md` and `specs/parser.spec.md` for details. Adapter READMEs document their function signatures.

## License

MIT © 2025
