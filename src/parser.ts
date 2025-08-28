import { splitByHeadings } from './utils/markdown-utils.js';
import {
  extractTestTags,
  hasAnyTestTags,
  isValidTest,
} from './utils/tag-utils.js';
import { validateTestStructure } from './utils/test-validation.js';

export type TestCase = {
  name: string;
  input: string;
  output?: string;
  error?: string;
};

export type ParseResult = {
  tests: TestCase[];
};

/**
 * Parse markdown content to extract test cases.
 */
export function parseMarkdown(content: string): ParseResult {
  const tests: TestCase[] = [];
  const sections = splitByHeadings(content);

  for (const { heading, content: sectionContent } of sections) {
    // Check for tags without heading (error case per spec)
    if (!heading && hasAnyTestTags(sectionContent)) {
      throw new Error('Invalid test: tags found but no heading');
    }

    // Skip sections without a heading
    if (!heading) {
      continue;
    }

    // Extract all test tags from this section
    const tags = extractTestTags(sectionContent);

    // Skip sections without any test tags (documentation sections)
    if (!isValidTest(tags)) {
      continue;
    }

    // Validate the test structure
    const validationError = validateTestStructure(heading, tags);
    if (validationError) {
      throw new Error(validationError.message);
    }

    // Create the test case
    const test: TestCase = {
      name: heading,
      input: tags.input?.content || '',
    };

    if (tags.output) {
      test.output = tags.output.content;
    }

    if (tags.error) {
      test.error = tags.error.content;
    }

    tests.push(test);
  }

  return { tests };
}
