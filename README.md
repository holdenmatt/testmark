# mdtest

Write unit tests in markdown. Run them in any test framework (like `vitest` or `pytest`).

## Why?

Many important functions (`slugify` for example) are text-to-text.

LLM prompts or specs can also be viewed as functions from one or more input strings to an output string.

The documentation or "spec" for such a function is often written in Markdown, but how should we test it?

Since input/output examples are just text, it's natural to also write test cases in Markdown, which can complement or help define a "spec" for the function.

All that's needed is:
- A parser from Markdown test cases to input/output pairs
- A small "adapter" to map an input/output to a specific test framework

`mdtest` provides this parser as a Unix-style CLI tool, and includes adapters for `pytest` in Python and `vitest` in TypeScript/JavaScript.

## `test.md` files

As a naming convention, we use the `.test.md` extension for Markdown test files. Put them wherever makes sense - next to the code they test, in a `tests/` directory, or anywhere else. They define plain text, self-documenting, language agnostic unit tests.

Here's an example of what `slugify.test.md` might look like:

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

Both packages provide the same CLI. The Python package requires Node to be installed.

## Quick Start

### Using the CLI

The CLI parses test files to JSON:

```bash
# Parse test cases to JSON on stdout
mdtest slugify.test.md

# Parse multiple files
mdtest *.test.md

# Pipe to other tools
mdtest slugify.test.md | jq '.tests[0]'
# {
#   "name": "Spaces to Dashes",
#   "input": "Hello World",
#   "output": "hello-world"
# }
```

This makes mdtest composable with other Unix tools while leaving test execution and reporting to your favorite test framework.

### Test Frameworks

The framework adapters parse your `.test.md` files and generate native test cases that your test runner executes and reports on.

We provide an adapter for `vitest`:

```typescript
import { mdtest } from 'mdtest/vitest';
import { slugify } from './slugify';

mdtest('slugify.test.md', slugify);
```

And `pytest`:

```python
from mdtest import mdtest
from slugify import slugify

mdtest('slugify.test.md', slugify)
```

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
