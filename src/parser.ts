import { splitByHeadings } from './utils/markdown.js';
import {
  extractTestTags,
  hasAnyTestTags,
  isTestSection,
} from './utils/tags.js';
import { validateTestStructure } from './utils/validation.js';

export type TestCase = {
  name: string;
  input: string;
  output?: string;
  error?: string;
  files?: Record<string, string>;
};

export type ParseResult = {
  tests: TestCase[];
};

/**
 * Parse markdown content to extract test cases.
 */
export function parseMarkdown(content: string): ParseResult {
  // Normalize EOLs once up front (CRLF and lone CR → LF)
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const tests: TestCase[] = [];
  const sections = splitByHeadings(normalized);

  for (const { heading, content: sectionContent } of sections) {
    // Check for tags without heading (error case per spec)
    if (!heading && hasAnyTestTags(sectionContent)) {
      throw new Error('Invalid test: tags found before first heading');
    }

    // Skip sections without a heading
    if (!heading) {
      continue;
    }

    // Extract all test tags from this section
    const tags = extractTestTags(sectionContent);

    // Skip sections without any test tags (documentation sections)
    if (!isTestSection(tags)) {
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

    // Collect file fixtures (if any)
    if (tags.files && tags.files.length > 0) {
      test.files = {};
      for (const f of tags.files) {
        if (!f.unclosed) {
          test.files[f.name] = f.content;
        }
      }
    }

    tests.push(test);
  }

  return { tests };
}
