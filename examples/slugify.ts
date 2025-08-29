/**
 * Example slugify function to demonstrate TestMark
 *
 * Converts text to URL-friendly slugs.
 * This could be any string -> string function, in real usage.
 */
export function slugify(text: string): string {
  if (text === '') {
    throw new Error('Input cannot be empty');
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}
