import { testmark } from '../adapters/vitest/index.js';
import { slugify } from '../examples/slugify.js';

// Test the slugify example using TestMark
testmark('examples/slugify.test.md', slugify);
