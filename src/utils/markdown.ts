/**
 * Utilities for parsing markdown structure (headings, sections, etc.)
 */

export type Section = { heading: string | null; content: string };

/**
 * Split markdown content by headings (any level).
 * - Ignores headings that appear inside fenced code blocks (``` or ~~~)
 * - Preserves all other content verbatim
 */
export function splitByHeadings(markdown: string): Section[] {
  const sections: Section[] = [];

  const lines = markdown.split(/\r?\n/);
  let inFence = false;
  let fenceMarker: '```' | '~~~' | null = null;
  let fenceLen = 0;

  let currentHeading: string | null = null;
  const buffer: string[] = [];

  const flush = () => {
    const content = buffer.join('\n');
    if (content.trim().length > 0) {
      sections.push({ heading: currentHeading, content });
    }
    buffer.length = 0;
  };

  for (const line of lines) {
    // Detect fenced code blocks (open/close)
    const fenceMatch = line.match(/^(```+|~~~+)/);
    if (fenceMatch) {
      const marker = fenceMatch[1].startsWith('```') ? '```' : '~~~';
      const len = fenceMatch[1].length;
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
        fenceLen = len;
      } else if (fenceMarker === marker && len >= fenceLen) {
        // Close the fence when marker matches and length is sufficient
        inFence = false;
        fenceMarker = null;
        fenceLen = 0;
      }
      // Fence lines are preserved as part of content
      buffer.push(line);
      continue;
    }

    // Headings are only recognized when not inside a fence
    if (!inFence && /^#{1,6}\s+\S/.test(line)) {
      // New heading: flush previous content block
      flush();
      currentHeading = line.replace(/^#{1,6}\s+/, '').trim();
      continue;
    }

    buffer.push(line);
  }

  // Flush any remaining content
  flush();

  return sections;
}
