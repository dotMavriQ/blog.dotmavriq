import { visit } from "unist-util-visit";

const SENTENCE_BOUNDARY = /[.!?]["')\]]?\s+/g;

function isFootnoteRef(node) {
  if (node?.type !== "element" || node.tagName !== "sup") return false;
  return node.children?.some(
    (child) =>
      child.type === "element" &&
      child.tagName === "a" &&
      child.properties &&
      Object.hasOwn(child.properties, "dataFootnoteRef"),
  );
}

function lastSentenceStart(value) {
  let start = 0;
  let match;
  while ((match = SENTENCE_BOUNDARY.exec(value)) !== null) {
    start = match.index + match[0].length;
  }
  return start;
}

function wrapPreviousSentence(children, footnoteIndex) {
  for (let i = footnoteIndex - 1; i >= 0; i--) {
    const node = children[i];
    if (node?.type === "text" && !node.value.trim()) continue;
    if (isFootnoteRef(node)) return;
    if (node?.type === "element" && node.properties?.className?.includes("citation-scope")) return;
    break;
  }

  for (let i = footnoteIndex - 1; i >= 0; i--) {
    const node = children[i];
    if (!node || node.type !== "text" || !node.value.trim()) continue;

    const start = lastSentenceStart(node.value);
    const before = node.value.slice(0, start);
    const cited = node.value.slice(start);
    if (!cited.trim()) continue;

    const replacement = [];
    if (before) replacement.push({ ...node, value: before });
    replacement.push({
      type: "element",
      tagName: "span",
      properties: { className: ["citation-scope"] },
      children: [{ ...node, value: cited }],
    });

    children.splice(i, 1, ...replacement);
    return;
  }
}

export default function rehypeCitationScope() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (!Array.isArray(node.children)) return;

      for (let i = 0; i < node.children.length; i++) {
        if (!isFootnoteRef(node.children[i])) continue;
        wrapPreviousSentence(node.children, i);
      }
    });
  };
}
