# mdtest

Write unit tests in markdown. Run them in any test framework (like `vitest` or `pytest`).

## What it does

`mdtest` lets you write test cases (for string -> string functions) as readable markdown documentation that can also be executed as tests. Write your test cases once, run them across multiple languages or test frameworks.

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

<input>It's amazing!</input>
<output>its-amazing</output>

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
npm install @holdenmatt/mdtest
```

**Python:**

```bash
(Coming soon)
```

## Quick Start

### Test Frameworks

The framework adapters parse your `.test.md` files and generate native test cases that your test runner executes and reports on.

#### Vitest

```typescript
import { mdtest } from 'mdtest/vitest';
import { slugify } from './slugify';

mdtest('slugify.test.md', slugify);
```

#### Pytest

```python
from mdtest import mdtest
from slugify import slugify

mdtest('slugify.test.md', slugify)
```

Your test runner will execute each test case from the markdown file, reporting passes and failures just like any other test.

### CLI Tool

There's also a CLI that parses test files to JSON:

```bash
# Parse test cases to JSON
mdtest slugify.test.md

# Parse multiple files
mdtest *.test.md
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

## License

MIT © 2025
