/**
 * Utilities for extracting and working with mdtest tags (<input>, <output>, etc.)
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

/**
 * Extract a specific tag from a section of markdown.
 * Checks for both full tags (e.g., <input>) and aliases (e.g., <i>).
 */
export function extractTag(
  section: string,
  tagNames: string[]
): TagMatch | null {
  for (const tag of tagNames) {
    // First check for complete tag pairs
    const matches = [
      ...section.matchAll(new RegExp(`<${tag}>(.*?)</${tag}>`, 'gs')),
    ];

    if (matches.length > 0) {
      return {
        content: matches[0][1],
        count: matches.length,
        unclosed: false,
      };
    }

    // Check for this specific tag (not aliases)
    const openTagRegex = new RegExp(`<${tag}>`, 'g');
    const openMatches = section.match(openTagRegex);

    if (openMatches && openMatches.length > 0) {
      // Only check closing tags if we found opening tags
      const closeTagRegex = new RegExp(`</${tag}>`, 'g');
      const closeMatches = section.match(closeTagRegex);

      if (!closeMatches || openMatches.length !== closeMatches.length) {
        return { content: '', count: openMatches.length, unclosed: true };
      }
    }
  }

  return null;
}

/**
 * Extract all test tags from a markdown section.
 * Tries main tags first (input, output, error), then aliases (i, o, e).
 */
export function extractTestTags(section: string): TestTags {
  const inputMatch =
    extractTag(section, ['input']) || extractTag(section, ['i']);
  const outputMatch =
    extractTag(section, ['output']) || extractTag(section, ['o']);
  const errorMatch =
    extractTag(section, ['error']) || extractTag(section, ['e']);

  return { input: inputMatch, output: outputMatch, error: errorMatch };
}

/**
 * Check if a section has any test tags.
 * Used to detect tags without headings (which is an error).
 */
export function hasAnyTestTags(section: string): boolean {
  return Boolean(section.match(/<(input|i|output|o|error|e)>/));
}

/**
 * Check if extracted tags represent a valid test.
 * A valid test has at least one tag present.
 */
export function isValidTest(tags: TestTags): boolean {
  const { input, output, error } = tags;
  return Boolean(input || output || error);
}
