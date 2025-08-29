#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { type ParseResult, parseMarkdown } from './parser.js';

async function main() {
  const args = process.argv.slice(2);

  // Handle help flag
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  // Handle version flag
  if (args.includes('--version')) {
    await showVersion();
    process.exit(0);
  }

  // Filter out flags to get file paths
  const files = args.filter((arg) => !arg.startsWith('-'));

  // Check if files were provided
  if (files.length === 0) {
    console.error('Error: No files specified');
    console.error('Usage: testmark [options] <files...>');
    process.exit(1);
  }

  try {
    // Process files
    const results: ParseResult[] = [];

    for (const file of files) {
      const filePath = resolve(file);
      const content = await readFile(filePath, 'utf-8');

      try {
        const result = parseMarkdown(content);
        results.push(result);
      } catch (error) {
        // Parser error - include file name in error message
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error in ${basename(file)}: ${message}`);
        process.exit(1);
      }
    }

    // Output results as JSON
    if (results.length === 1) {
      // Single file: output single object
      console.log(JSON.stringify(results[0], null, 2));
    } else {
      // Multiple files: output array
      console.log(JSON.stringify(results, null, 2));
    }
  } catch (error) {
    // File reading error
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`TestMark - Parse Markdown test files to JSON

Usage: testmark [options] <files...>

Options:
  --help, -h     Show this help message
  --version      Show version number

Examples:
  testmark test.md
  testmark *.test.md
  testmark tests/**/*.test.md`);
}

async function showVersion() {
  try {
    const pkgUrl = new URL('../package.json', import.meta.url);
    const packageContent = await readFile(pkgUrl, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    console.log(packageJson.version);
  } catch {
    console.log('unknown');
  }
}

// Run the CLI
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
