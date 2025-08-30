/**
 * Utilities for parsing markdown structure (headings, sections, etc.)
 */

export type Section = { heading: string | null; content: string };

/**
 * Split markdown content by headings (any level).
 * - Ignores headings inside fenced code blocks and test tags
 * - Preserves all other content verbatim
 */
export function splitByHeadings(markdown: string): Section[] {
  const sections: Section[] = [];

  // Store replaced blocks to restore later
  const replacements: string[] = [];

  // Replace fenced code blocks and test tags to hide any headings inside them
  const cleaned = markdown
    // Replace fenced code blocks (``` or ~~~)
    .replace(/(```|~~~)[\s\S]*?\1/g, (match) => {
      replacements.push(match);
      return `__BLOCK_${replacements.length - 1}__`;
    })
    // Replace test tags to hide headings inside them
    .replace(/<(input|output|error)>([\s\S]*?)<\/\1>/g, (match) => {
      replacements.push(match);
      return `__BLOCK_${replacements.length - 1}__`;
    })
    // Replace file tags to hide headings inside them
    .replace(/<file\s+name="[^"]*">([\s\S]*?)<\/file>/g, (match) => {
      replacements.push(match);
      return `__BLOCK_${replacements.length - 1}__`;
    });

  // Now split by headings (safe since headings in blocks are hidden)
  const parts = cleaned.split(/^(#{1,6}\s+.+)$/m);

  let currentHeading: string | null = null;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // Skip empty parts
    if (!part.trim()) {
      continue;
    }

    // Check if this is a heading
    if (/^#{1,6}\s+/.test(part)) {
      currentHeading = part.replace(/^#{1,6}\s+/, '').trim();
      continue;
    }

    // Restore the replaced blocks in this content
    let content = part;
    replacements.forEach((block, idx) => {
      content = content.replace(`__BLOCK_${idx}__`, block);
    });

    // Add section if it has content
    if (content.trim()) {
      sections.push({ heading: currentHeading, content: content.trim() });
    }
  }

  return sections;
}
