# mdtest (Python)

Minimal Python adapter around the Node `mdtest` parser.

## Requirements

- Python 3.8+
- Node.js and the global `mdtest` CLI from npm (`npm i -g mdtest`)

## Usage

Pytest adapter:

```python
from mdtest import mdtest
from slugify import slugify

mdtest('examples/slugify.test.md', slugify)
```

## How it works

The Python package defers to the Node CLI for parsing and expects a global `mdtest` binary on PATH.

## Running Tests

To test the Python adapter:

```bash
cd python
uv sync  # Install dependencies including pytest
uv run pytest test_mdtest.py -v
```

The test file demonstrates using mdtest with a simple `slugify` implementation against the example markdown tests.

## Release process

To publish a release:

1. Bump version in `python/pyproject.toml`
2. Build and publish with uv:
   ```bash
   uv build
   uv publish
   ```

The Python adapter version is independent of the Node CLI version since it simply calls the globally installed `mdtest` command.
