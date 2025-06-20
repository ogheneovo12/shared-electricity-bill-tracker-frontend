export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "...";
};

export function normalizeString(input: string, delimiter: string): string {
  if (!delimiter) return input;
  const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters
  const regex = new RegExp(escapedDelimiter, "g");
  return input.replace(regex, " ");
}
