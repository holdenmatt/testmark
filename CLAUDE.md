# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📚 Onboarding

At the start of each session, read:

1. `README.md` - Project overview and usage
2. `specs/*.spec.md` - Implementation specs
3. `tests/*.test.md` - Test cases using TestMark format

## ✅ Quality Gates

Before finishing any code changes:

1. Run `pnpm format` to auto-fix all formatting/linting issues
2. Run `pnpm lint` to check for any remaining issues
3. Run `pnpm test` to ensure all tests pass

## 🏗️ Implementation Notes

- Zero dependencies for the parser and CLI (use Node built-ins only)
- Parser is a pure function: markdown string → JSON
- CLI adds file handling layer on top of parser
- Tests are written in Markdown using TestMark's format
