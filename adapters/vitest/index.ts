import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseMarkdown, type TestCase } from '../../src/parser.js';

/**
 * Run TestMark format tests in vitest
 * @param testFile - Path to the .test.md file
 * @param fn - Function to test (input, optional files map). Can be sync or async.
 */
export function testmark(
  testFile: string,
  fn: (
    input: string,
    files?: Record<string, string>
  ) => string | Promise<string>
): void {
  const fullPath = resolve(testFile);
  const content = readFileSync(fullPath, 'utf-8');

  let testCases: TestCase[];
  try {
    const result = parseMarkdown(content);
    testCases = result.tests;
  } catch (error) {
    throw new Error(`Failed to parse test file ${testFile}: ${error}`);
  }

  describe(testFile, () => {
    for (const testCase of testCases) {
      it(testCase.name, async () => {
        if (testCase.error !== undefined) {
          // Expect the function to throw (handle both sync and async)
          const resultPromise = Promise.resolve().then(() =>
            fn(testCase.input, testCase.files)
          );
          await expect(resultPromise).rejects.toThrow(testCase.error);
        } else {
          // Expect the function to return the output string
          const result = await fn(testCase.input, testCase.files);
          expect(result).toBe(testCase.output);
        }
      });
    }
  });
}
