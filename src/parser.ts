export interface TestCase {
	name: string;
	input: string;
	output?: string;
	error?: string;
}

export interface ParseResult {
	tests: TestCase[];
}

export function parseMarkdown(content: string): ParseResult {
	const tests: TestCase[] = [];

	// Split content by headings (any level)
	const sections = content.split(/^(#{1,6}\s+.+)$/gm);

	let currentHeading: string | null = null;

	for (let i = 0; i < sections.length; i++) {
		const section = sections[i];

		// Check if this is a heading
		if (/^#{1,6}\s+/.test(section)) {
			// Extract heading text (remove # symbols and trim)
			currentHeading = section.replace(/^#{1,6}\s+/, "").trim();
			continue;
		}

		// Skip empty sections or sections without headings
		if (!section.trim() || !currentHeading) {
			// Check if section has tags but no heading
			if (section.match(/<(input|i|output|o|error|e)>/)) {
				throw new Error("Invalid test: tags found but no heading");
			}
			continue;
		}

		// Look for test tags in this section
		const inputMatch = extractTag(section, ["input", "i"]);
		const outputMatch = extractTag(section, ["output", "o"]);
		const errorMatch = extractTag(section, ["error", "e"]);

		// Skip sections without any tags (documentation sections)
		if (!inputMatch && !outputMatch && !errorMatch) {
			continue;
		}

		// Validate test structure
		validateTestStructure(
			currentHeading,
			section,
			inputMatch,
			outputMatch,
			errorMatch,
		);

		// Create test case
		const test: TestCase = {
			name: currentHeading,
			input: inputMatch?.content || "",
		};

		if (outputMatch) {
			test.output = outputMatch.content;
		}

		if (errorMatch) {
			test.error = errorMatch.content;
		}

		tests.push(test);
	}

	return { tests };
}

interface TagMatch {
	content: string;
	count: number;
	unclosed: boolean;
}

function extractTag(section: string, tagNames: string[]): TagMatch | null {
	for (const tag of tagNames) {
		// Check for unclosed tags
		const openTagRegex = new RegExp(`<${tag}>`, "g");
		const closeTagRegex = new RegExp(`</${tag}>`, "g");
		const openMatches = section.match(openTagRegex);
		const closeMatches = section.match(closeTagRegex);

		if (
			openMatches &&
			(!closeMatches || openMatches.length !== closeMatches.length)
		) {
			return { content: "", count: openMatches.length, unclosed: true };
		}

		// Extract content with non-greedy regex
		const matches = [
			...section.matchAll(new RegExp(`<${tag}>(.*?)</${tag}>`, "gs")),
		];

		if (matches.length > 0) {
			return {
				content: matches[0][1],
				count: matches.length,
				unclosed: false,
			};
		}
	}

	return null;
}

function validateTestStructure(
	heading: string,
	_section: string,
	inputMatch: TagMatch | null,
	outputMatch: TagMatch | null,
	errorMatch: TagMatch | null,
): void {
	// Check for unclosed tags
	if (inputMatch?.unclosed) {
		throw new Error(`Invalid test "${heading}": unclosed input tag`);
	}
	if (outputMatch?.unclosed) {
		throw new Error(`Invalid test "${heading}": unclosed output tag`);
	}
	if (errorMatch?.unclosed) {
		throw new Error(`Invalid test "${heading}": unclosed error tag`);
	}

	// Check for multiple tags of same type
	if (inputMatch && inputMatch.count > 1) {
		throw new Error(`Invalid test "${heading}": multiple input tags found`);
	}
	if (outputMatch && outputMatch.count > 1) {
		throw new Error(`Invalid test "${heading}": multiple output tags found`);
	}
	if (errorMatch && errorMatch.count > 1) {
		throw new Error(`Invalid test "${heading}": multiple error tags found`);
	}

	// Check for both output and error
	if (outputMatch && errorMatch) {
		throw new Error(
			`Invalid test "${heading}": cannot have both output and error`,
		);
	}

	// Check for input without output/error
	if (inputMatch && !outputMatch && !errorMatch) {
		throw new Error(
			`Invalid test "${heading}": has input but no output or error`,
		);
	}

	// Check for output/error without input
	if (!inputMatch && (outputMatch || errorMatch)) {
		const type = outputMatch ? "output" : "error";
		throw new Error(`Invalid test "${heading}": has ${type} but no input`);
	}
}
