#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { basename, extname, join, resolve } from 'node:path';
import { analyze } from 'textlens';

const BLOG_DIR = resolve('src/content/blog');
const DEFAULT_MAX_PARAGRAPH_WORDS = 110;

function stripFrontmatter(text) {
  return text.replace(/^---\n[\s\S]*?\n---\n*/u, '');
}

function stripFootnotes(text) {
  return text
    .replace(/^\[\^[^\]]+\]:\s+.+$/gmu, '')
    .replace(/\[\^[^\]]+\]/gu, '');
}

function stripHtmlBlocks(text) {
  return text
    .replace(/<table[\s\S]*?<\/table>/giu, '')
    .replace(/<[^>]+>/gu, '');
}

function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gmu, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gu, '$1')
    .replace(/`{3}[\s\S]*?`{3}/gu, '')
    .replace(/`([^`]+)`/gu, '$1')
    .replace(/^>\s?/gmu, '')
    .replace(/^[-*+]\s+/gmu, '')
    .replace(/^\d+\.\s+/gmu, '')
    .replace(/^\|.*\|$/gmu, '')
    .replace(/^\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+$/gmu, '')
    .replace(/\*\*([^*]+)\*\*/gu, '$1')
    .replace(/\*([^*]+)\*/gu, '$1')
    .replace(/_([^_]+)_/gu, '$1');
}

function normalizeText(text) {
  return stripMarkdown(stripHtmlBlocks(stripFootnotes(stripFrontmatter(text))))
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function paragraphWordCount(paragraph) {
  return paragraph.trim().split(/\s+/u).filter(Boolean).length;
}

function summarizeParagraphs(text, maxParagraphWords) {
  return text
    .split(/\n\s*\n/u)
    .map((paragraph, index) => ({
      index: index + 1,
      words: paragraphWordCount(paragraph),
      preview: paragraph.replace(/\s+/gu, ' ').trim().slice(0, 110),
    }))
    .filter((paragraph) => paragraph.words > maxParagraphWords)
    .sort((a, b) => b.words - a.words);
}

async function resolveTargets(args) {
  if (args.length > 0) {
    return args.map((arg) => resolve(arg));
  }

  const entries = await readdir(BLOG_DIR);
  return entries
    .filter((entry) => ['.md', '.mdx'].includes(extname(entry)))
    .map((entry) => join(BLOG_DIR, entry));
}

async function auditFile(filePath, maxParagraphWords) {
  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) return null;

  const raw = await readFile(filePath, 'utf8');
  const normalized = normalizeText(raw);
  const result = analyze(normalized);
  const flaggedParagraphs = summarizeParagraphs(normalized, maxParagraphWords);

  return {
    filePath,
    title: basename(filePath),
    words: result.statistics.words,
    sentences: result.statistics.sentences,
    paragraphs: result.statistics.paragraphs,
    minutes: result.readingTime.minutes,
    grade: result.readability.consensusGrade,
    flesch: result.readability.fleschReadingEase.score,
    seo: result.seo?.score ?? null,
    flaggedParagraphs,
  };
}

function printAudit(result) {
  console.log(`\n${result.title}`);
  console.log(`  words: ${result.words}`);
  console.log(`  read time: ${result.minutes} min`);
  console.log(`  paragraphs: ${result.paragraphs}`);
  console.log(`  sentences: ${result.sentences}`);
  console.log(`  consensus grade: ${result.grade}`);
  console.log(`  flesch reading ease: ${result.flesch.toFixed(1)}`);
  if (typeof result.seo === 'number') {
    console.log(`  seo score: ${result.seo}`);
  }

  if (result.flaggedParagraphs.length === 0) {
    console.log(`  dense paragraphs: none over ${DEFAULT_MAX_PARAGRAPH_WORDS} words`);
    return;
  }

  console.log(`  dense paragraphs (> ${DEFAULT_MAX_PARAGRAPH_WORDS} words):`);
  for (const paragraph of result.flaggedParagraphs.slice(0, 5)) {
    console.log(`    #${paragraph.index} — ${paragraph.words} words`);
    console.log(`      ${paragraph.preview}${paragraph.preview.length >= 110 ? '…' : ''}`);
  }
}

const args = process.argv.slice(2);
const maxParagraphWords = DEFAULT_MAX_PARAGRAPH_WORDS;
const targets = await resolveTargets(args);
const audits = [];

for (const target of targets) {
  const audit = await auditFile(target, maxParagraphWords);
  if (audit) audits.push(audit);
}

audits.sort((a, b) => b.words - a.words);
audits.forEach(printAudit);
