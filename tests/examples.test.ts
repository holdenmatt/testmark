import { slugify } from '../examples/slugify.js';
import { testmark } from '../src/adapters/vitest.js';

// Test the slugify example using TestMark
testmark('examples/slugify.test.md', slugify);
