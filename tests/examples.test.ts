import { slugify } from '../examples/slugify.js';
import { mdtest } from '../src/adapters/vitest.js';

// Test the slugify example using mdtest
mdtest('examples/slugify.test.md', slugify);
