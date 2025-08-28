/**
 * Utilities for parsing markdown structure (headings, sections, etc.)
 */

/**
 * Split markdown content by headings (any level).
 * Returns an array of {heading, content} pairs.
 */
export function splitByHeadings(
  markdown: string
): Array<{ heading: string | null; content: string }> {
  const sections: Array<{ heading: string | null; content: string }> = [];
  const parts = markdown.split(/^(#{1,6}\s+.+)$/gm);

  let currentHeading: string | null = null;

  for (const part of parts) {
    // Check if this is a heading
    if (/^#{1,6}\s+/.test(part)) {
      // Extract heading text (remove # symbols and trim)
      currentHeading = part.replace(/^#{1,6}\s+/, '').trim();
      continue;
    }

    // Skip empty sections
    if (!part.trim()) {
      continue;
    }

    sections.push({ heading: currentHeading, content: part });
  }

  return sections;
}
