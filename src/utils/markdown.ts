export function extractTitleFromMarkdown(text: string): string {
  const match = text.match(/^#\s+(.+)$/m);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '文档';
}

