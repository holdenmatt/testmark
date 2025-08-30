# CLI Spec

## Command Structure

```
testmark [options] <files...>
```

## Arguments & Options

- Accepts one or more file paths
- Shell handles glob expansion
- No arguments shows error and exits with code 1
- `--help`, `-h` - Show usage and exit
- `--version` - Show version from package.json and exit

## Output

- JSON to stdout (pretty-printed, 2-space indent)
- Single file: returns single object
- Multiple files: returns array of objects
- Error messages to stderr
- Exit code 0 on success, 1 on any error
- Any error prevents all output (fail fast)
- Test objects include a `files` map (empty object if no `<file>` tags)

## Implementation Notes

- Zero dependencies - use `process.argv` directly
- Read files with built-in `fs/promises`
- Parse args manually (simple includes/filter)
- Parser normalizes line endings and block-trims boundary newlines; CLI prints parser output verbatim
