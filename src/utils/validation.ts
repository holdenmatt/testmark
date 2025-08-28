/**
 * Validation logic for mdtest test cases.
 * Ensures test structure follows the spec.
 */

import type { TestTags } from './tags.js';

export type ValidationError = {
  type:
    | 'unclosed_tag'
    | 'multiple_tags'
    | 'both_output_error'
    | 'missing_input'
    | 'missing_output';
  message: string;
};

/**
 * Validate that test tags are properly structured according to spec.
 * Returns null if valid, or a ValidationError if not.
 */
export function validateTestStructure(
  heading: string,
  tags: TestTags
): ValidationError | null {
  const { input, output, error } = tags;

  // Check for unclosed tags
  if (input?.unclosed) {
    return {
      type: 'unclosed_tag',
      message: `Invalid test "${heading}": unclosed input tag`,
    };
  }
  if (output?.unclosed) {
    return {
      type: 'unclosed_tag',
      message: `Invalid test "${heading}": unclosed output tag`,
    };
  }
  if (error?.unclosed) {
    return {
      type: 'unclosed_tag',
      message: `Invalid test "${heading}": unclosed error tag`,
    };
  }

  // Check for multiple tags of same type
  if (input && input.count > 1) {
    return {
      type: 'multiple_tags',
      message: `Invalid test "${heading}": multiple input tags found`,
    };
  }
  if (output && output.count > 1) {
    return {
      type: 'multiple_tags',
      message: `Invalid test "${heading}": multiple output tags found`,
    };
  }
  if (error && error.count > 1) {
    return {
      type: 'multiple_tags',
      message: `Invalid test "${heading}": multiple error tags found`,
    };
  }

  // Check for both output and error (mutually exclusive)
  if (output && error) {
    return {
      type: 'both_output_error',
      message: `Invalid test "${heading}": cannot have both output and error`,
    };
  }

  // Check for input without output/error
  if (input && !output && !error) {
    return {
      type: 'missing_output',
      message: `Invalid test "${heading}": has input but no output or error`,
    };
  }

  // Check for output/error without input
  if (!input && (output || error)) {
    const type = output ? 'output' : 'error';
    return {
      type: 'missing_input',
      message: `Invalid test "${heading}": has ${type} but no input`,
    };
  }

  return null;
}
