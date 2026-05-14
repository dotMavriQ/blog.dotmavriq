const FOOTNOTE_DEFINITION = /^\[\^[^\]]+\]:[ \t][^\n]*(?:\n(?:[ \t]+[^\n]*|\s*))*/gm;
const FENCED_CODE_BLOCK = /```[\s\S]*?```/g;
const INDENTED_CODE_BLOCK = /(?:^|\n)(?: {4,}|\t)[^\n]*(?=\n|$)/g;
const INLINE_CODE = /`[^`\n]*`/g;
const HTML_BLOCK = /<[^>]+>/g;
const URL = /https?:\/\/\S+/g;
const MARKDOWN_LINK_URL = /\]\([^)]+\)/g;
const IMAGE_SYNTAX = /!\[[^\]]*\]\([^)]*\)/g;
const FRONTMATTER = /^---\n[\s\S]*?\n---\n?/;

const WORDS_PER_MINUTE = 200;

export function countReadableWords(markdown: string): number {
  if (!markdown) return 0;

  const stripped = markdown
    .replace(FRONTMATTER, "")
    .replace(IMAGE_SYNTAX, "")
    .replace(FOOTNOTE_DEFINITION, "")
    .replace(FENCED_CODE_BLOCK, "")
    .replace(INDENTED_CODE_BLOCK, "")
    .replace(INLINE_CODE, "")
    .replace(HTML_BLOCK, "")
    .replace(MARKDOWN_LINK_URL, "]")
    .replace(URL, "");

  const tokens = stripped.split(/\s+/).filter((token) => /\w/.test(token));
  return tokens.length;
}

export function estimateReadingMinutes(markdown: string): number {
  const words = countReadableWords(markdown);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
