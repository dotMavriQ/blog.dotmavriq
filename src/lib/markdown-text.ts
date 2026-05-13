function replaceMarkdownLinks(input: string): string {
  let out = "";
  let i = 0;

  while (i < input.length) {
    const isImage = input[i] === "!" && input[i + 1] === "[";
    const linkStart = isImage ? i + 1 : i;

    if (input[linkStart] !== "[") {
      out += input[i];
      i++;
      continue;
    }

    const labelEnd = input.indexOf("]", linkStart + 1);
    if (labelEnd === -1 || input[labelEnd + 1] !== "(") {
      out += input[i];
      i++;
      continue;
    }

    let depth = 1;
    let urlEnd = labelEnd + 2;
    while (urlEnd < input.length && depth > 0) {
      const char = input[urlEnd];
      if (char === "(") depth++;
      if (char === ")") depth--;
      urlEnd++;
    }

    if (depth !== 0) {
      out += input[i];
      i++;
      continue;
    }

    if (!isImage) out += input.slice(linkStart + 1, labelEnd);
    i = urlEnd;
  }

  return out;
}

export function markdownToPlainText(raw: string, options: { dropHeadings?: boolean } = {}): string {
  const withoutCode = raw
    .replace(/^---[\s\S]*?---\n*/m, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^import\s+.*$/gm, "")
    .replace(/^export\s+.*$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/<div\s+class="series-intro"[^>]*>[\s\S]*?<\/div>/gi, " ");

  const withoutLinks = replaceMarkdownLinks(withoutCode);

  return withoutLinks
    .replace(/<[^>]+>/g, " ")
    .replace(options.dropHeadings ? /^#{1,6}\s+.*$/gm : /^#{1,6}\s+/gm, "")
    .replace(/\[\^(\d+)\]:\s*.+$/gm, "")
    .replace(/\[\^(\d+)\]/g, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s/gm, "")
    .replace(/^\d+\.\s/gm, "")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
