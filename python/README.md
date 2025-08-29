# TestMark (Python)

Minimal Python adapter around the Node `testmark` parser.

## Requirements

- Python 3.8+
- Node.js and the global `testmark` CLI from npm (`npm i -g testmark`)

## Usage

Pytest adapter:

```python
from testmark import testmark
from slugify import slugify

testmark('examples/slugify.test.md', slugify)
```

## How it works

The Python package defers to the Node CLI for parsing and expects a global `testmark` binary on PATH.

## Running Tests

To test the Python adapter:

```bash
cd python
uv sync  # Install dependencies including pytest
uv run pytest test_testmark.py -v
```

The test file demonstrates using TestMark with a simple `slugify` implementation against the example markdown tests.

## Release process

To publish a release:

1. Bump version in `python/pyproject.toml`
2. Build and publish with uv:
   ```bash
   uv build
   uv publish
   ```

The Python adapter version is independent of the Node CLI version since it simply calls the globally installed `testmark` command.
