/**
 * Utilities for extracting and working with TestMark tags (<input>, <output>, <error>)
 */

export type TagMatch = {
  content: string;
  count: number;
  unclosed: boolean;
};

export type TestTags = {
  input: TagMatch | null;
  output: TagMatch | null;
  error: TagMatch | null;
};

export type TagName = 'input' | 'output' | 'error';
const ANY_TAG_RE = /<(input|output|error)>/;

/**
 * Extract a specific tag from a section of markdown.
 */
export function extractTag(section: string, tagName: TagName): TagMatch | null {
  // First check for complete tag pairs
  const matches = [
    ...section.matchAll(new RegExp(`<${tagName}>(.*?)</${tagName}>`, 'gs')),
  ];

  if (matches.length > 0) {
    return {
      content: matches[0][1],
      count: matches.length,
      unclosed: false,
    };
  }

  // Check for unclosed tags
  const openTagRegex = new RegExp(`<${tagName}>`, 'g');
  const openMatches = section.match(openTagRegex);

  if (openMatches && openMatches.length > 0) {
    // Only check closing tags if we found opening tags
    const closeTagRegex = new RegExp(`</${tagName}>`, 'g');
    const closeMatches = section.match(closeTagRegex);

    if (!closeMatches || openMatches.length !== closeMatches.length) {
      return { content: '', count: openMatches.length, unclosed: true };
    }
  }

  return null;
}

/**
 * Extract all test tags from a markdown section.
 */
export function extractTestTags(section: string): TestTags {
  return {
    input: extractTag(section, 'input'),
    output: extractTag(section, 'output'),
    error: extractTag(section, 'error'),
  };
}

/**
 * Check if a section has any test tags.
 * Used to detect tags without headings (which is an error).
 */
export function hasAnyTestTags(section: string): boolean {
  return ANY_TAG_RE.test(section);
}

/**
 * Check if extracted tags represent a valid test.
 * A valid test has at least one tag present.
 */
export function isTestSection(tags: TestTags): boolean {
  const { input, output, error } = tags;
  return Boolean(input || output || error);
}
