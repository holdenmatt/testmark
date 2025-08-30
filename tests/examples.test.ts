import { testmark } from '../adapters/vitest/index.js';
import { slugify } from '../examples/slugify.js';

testmark('examples/slugify.test.md', slugify);

testmark('examples/files.test.md', (input, files) => {
  if (input.startsWith('@')) {
    const name = input.slice(1);
    return files?.[name] || '';
  }
  return input;
});
