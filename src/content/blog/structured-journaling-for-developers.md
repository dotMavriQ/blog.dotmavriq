---
title: "Structured Notes for Developers"
pubDate: 2024-01-03
excerpt: "A note-taking system built on Markdown, Obsidian, Habitica, and a custom plugin that turns daily notes into queryable personal data."
tags: [Productivity]
heroImage: "/img/blog/structured-journaling-for-developers.webp"
draft: false
---

Markdown is deceptively ingenious. It looks like almost nothing: asterisks, hashes, backticks, dashes, brackets. A few marks around otherwise plain text. That is the trick. It keeps the writing readable before anything renders it.

John Gruber introduced Markdown in 2004 as a way for web writers to write in plain text and turn that text into HTML.[^1] The part I always liked is that the source text still reads like the thing it represents. A heading looks like a heading. A list looks like a list. A link looks a little clumsy, but still human enough to survive without a preview pane.

The syntax was not only Gruber's. GitHub's Markdown spec notes that Markdown was developed by Gruber with help from Aaron Swartz, the late internet activist and Reddit co-founder.[^2][^3] That lineage fits the format. Markdown feels like something made for the web before the web got buried under editors that hide the text from you.

It spread because the idea is small and useful. GitHub made Markdown part of the daily grammar of software work: READMEs, issues, pull requests, discussions, release notes. WhatsApp picked up the same general instinct for lightweight formatting with symbols for bold, italics, strikethrough, and monospace.[^4] Facebook groups eventually added richer post formatting for headings, lists, quotes, bold, and italics, rolled out around 2019.[^5] Blogs, static site generators, documentation tools, and note-taking apps all found their way to the same place: people want structure, but not at the cost of writing.

That is where notes get interesting. A note can be a scratchpad, a record, a task list, a log, a database row, or a future article. It should not try to be all of those things by default. The structure has to come from what you need the note to do.

I have tried enough personal systems to distrust any setup that asks me to maintain redundant versions of the same thought. If a task lives in one place, a journal in another, a habit tracker in a third, and a summary in a fourth, the system starts asking for more care than the work it was meant to support. Notes should reduce cognitive load. When they add ceremony, they quietly become another obligation.

This is the system that survived that filter for me: daily Markdown notes in Obsidian, a little Habitica sync, a few community plugins, and one custom plugin that turns parts of the note into useful data without making the note stop being a note.

## The setup

The system runs on [Obsidian](https://obsidian.md/), a Markdown-based knowledge management tool. Obsidian stores everything as plain `.md` files on disk. No proprietary format, no cloud dependency, no vendor lock-in on your own thoughts. The files live in a vault (a folder), and the plugin ecosystem handles everything from visualization to automation.

The journaling workflow depends on three community plugins and one custom one:

- [**Calendar**](https://github.com/liamcain/obsidian-calendar-plugin) by Liam Cain. A sidebar calendar that opens (or creates) the day's journal entry on click. Without it, you're manually creating `2024-01-03.md` files every morning, and that friction alone is enough to kill the habit within a week.
- [**Tracker**](https://github.com/pyrochlore/obsidian-tracker) by pyrochlore. Reads YAML frontmatter from journal entries and renders line charts, bar graphs, and summaries. This is where weeks of daily logging become visible trends.
- [**Emoji Toolbar**](https://github.com/oliveryh/obsidian-emoji-toolbar) by oliveryh. A quick picker for emoji entry. Small quality-of-life addition, but it matters for the Labels feature described below.
- [**Habsiad**](https://github.com/dotMavriQ/Habsiad), a custom plugin I built that ties the whole system together. More on this in a moment.

The point is not to make every day measurable. The point is to capture the parts of the day that are expensive to reconstruct from memory.

## What a journal entry looks like

Every entry lives in a `JOURNAL/` folder, named by date (`YYYY-MM-DD.md`). The template has a consistent structure:

```markdown
---
goodwork:
meditation:
workout:
cook:
book:
hydrated:
steps:
weight:
calories:
---
# MONDAY
## WORK:
###### Summary:

### Goals for Today:
- Goal 1
- Goal 2
- Goal 3
## LIFE:

### FOOD:
| Time      | MEAL | EST.CALORIES |
| --------- | ---- | ------------ |
| Breakfast |      |              |
| Lunch     |      |              |
| Dinner    |      |              |
| Snacks    |      |              |
### TODO:
Move real next actions to LIFE.md.

### Reflections:
```

The YAML frontmatter at the top is the key. Those empty keys get populated throughout the day, either manually or via sync, and the Tracker plugin graphs them over time. The body is freeform Markdown: work summaries, personal notes, food logs, whatever the day requires.

The weekday header updates automatically. The template only needs to be good enough to lower friction. If it tries to anticipate every possible future use, it becomes the problem.

## Habsiad: the glue layer

I built [Habsiad](https://github.com/dotMavriQ/Habsiad) as a bridge between Obsidian and [Habitica](https://habitica.com/), the gamified habit tracker. Habitica is effective at building habits through RPG mechanics (XP, levels, streaks, penalties for missed dailies), but it has a critical gap: it doesn't store historical data. You check something off and it vanishes. There's no way to look back at last month and see patterns.

Habsiad solves this by syncing completed Habits, Dailies, and TODOs from Habitica into the journal entry's frontmatter. One keystroke at the end of the day and every tracked behavior becomes a permanent, graphable data point.

The Habitica connection is optional. Habsiad's **Retrotagger** provides a UI for manually logging habits and dailies directly into any journal entry, past or present. The data format is identical either way. This means you can adopt the entire system without ever touching Habitica.

### Frontmatter Glossary

The Frontmatter Glossary maps Habitica habit and daily names to YAML keys in your journal template. Running "Sync Habitica to Frontmatter" transfers completion data into Obsidian's property system, where the Tracker plugin picks it up for visualization.

The result is not glamorous: a row of boolean or numeric values at the top of every journal file that external tools can query, graph, or export. That is exactly why it works.

It also keeps the source of truth small. The daily note is still the daily note. Habitica can help with behaviour. Tracker can help with charts. Habsiad can move data between them. But the file on disk remains the thing I can open, search, edit, and understand.

### Data Quality Diagnostics

Habsiad includes a diagnostic view that scans all journal entries and reports on data integrity: missing frontmatter keys, empty entries, inconsistencies in your tracking. Useful for catching gaps before they compound into unreliable trend lines.

### Labels: track anything with an emoji

This is the feature that made the system stop feeling like a template and start feeling like a tool. Anywhere in a journal entry, write an emoji followed by a colon and a number:

```
Drank a lot of water today `💧: 8`
Indoor temperature was brutal `🌡️: 31`
Read before bed `📖: 45`
```

Habsiad scans all entries and aggregates labels chronologically. Click any label and you get a timeline of every occurrence with its value. No schema changes, no configuration, no predefined categories. If you can express it as an emoji and a number, Habsiad tracks it.

This works because the data lives inline with your writing. You don't context-switch to a separate tracking app. You mention it in your daily notes the way you would mention it in conversation, and the structured data extracts itself later.

That matters more than it sounds. Most personal systems fail at the moment of capture. They ask for too much precision before the thought has settled. Inline labels let the note stay loose while still leaving something machine-readable behind.

### Logs: specialized journals within the journal

Logs use Obsidian's callout syntax to create categorized entries that Habsiad collects across your entire journal:

```markdown
> [!WORKOUT] #### Morning run
> 5K in 25 minutes. Shoulder still tight from yesterday.

> [!DREAM] #### The one with the server room
> Debugging a production outage in a building that kept
> adding floors. Classic stress dream.
```

Define any callout type you want. `[!WORKOUT]`, `[!MEETING]`, `[!DREAM]`, `[!IDEA]`. Habsiad groups all entries of the same type chronologically. Click the log category and you get a dedicated timeline view. It's a workout journal, a dream journal, and a meeting log without maintaining separate files for any of them.

That last part is important. Separate files are not free. Separate categories are not free. Every new place to put information creates a small decision tax. If the category is useful enough, fine. If it only exists because the tool makes it easy to create categories, it probably should not exist.

## What this looks like over time

The daily cost is low. Open today's note (one click via Calendar), fill in the template as the day happens, hit sync at the end. Five minutes of active effort on a typical day.

The compounding value is in the Tracker graphs. After a few weeks of consistent entries, the frontmatter data starts telling stories that memory alone cannot. Sleep patterns correlating with productivity. Exercise frequency drifting downward before you notice it consciously. Caloric intake trends that explain why the last month felt sluggish.

Developers understand the value of observability in production systems. This is the same instinct applied to yourself: instrument the day, store the telemetry, review the dashboards. It sounds a little absurd until the graph shows a three-week slide you had managed to explain away in your head. That is the difference between "I should exercise more" and an actionable signal.

The signal is the point, not the dashboard. A graph is only useful if it changes what you notice. A template is only useful if it makes the next entry easier. A plugin is only useful if it removes a small piece of repeated labour.

## Why Obsidian and not something else

[Org mode](https://en.wikipedia.org/wiki/Org-mode) in Emacs is powerful but has a learning curve that doubles as a barrier to consistency. [Joplin](https://en.wikipedia.org/wiki/Joplin_(software)) and [Logseq](https://logseq.com/) are solid tools but lack the plugin ecosystem depth. Notion stores your data on someone else's server.

Obsidian is not open source in the strict sense. It is a proprietary application backed by a subscription sync service. But the files it produces are plain Markdown on your local filesystem. If Obsidian disappears tomorrow, the journal entries remain perfectly readable and portable. The sync service is optional; some people use Git repositories instead.

The plugin ecosystem is what makes the difference. Calendar, Tracker, Emoji Toolbar, and Habsiad together create a workflow that no single app provides out of the box. Each plugin does one thing well, and Habsiad is the messy little orchestration layer that makes them behave like one system.

I do not think everyone needs this exact setup. I do think everyone benefits from asking what their notes are for. If the answer is "remember things", that is too vague. Remember what? For how long? To make which decision easier later? To notice which pattern? To avoid repeating which mistake?

## Getting started

1. Install [Obsidian](https://obsidian.md/) and create a vault.
2. Install the [Calendar](https://github.com/liamcain/obsidian-calendar-plugin), [Tracker](https://github.com/pyrochlore/obsidian-tracker), and [Emoji Toolbar](https://github.com/oliveryh/obsidian-emoji-toolbar) community plugins.
3. Install [Habsiad](https://github.com/dotMavriQ/Habsiad) and follow the [Getting Started guide](https://github.com/dotMavriQ/Habsiad/wiki/Getting-Started).
4. Create a `JOURNAL/` folder and a template with the frontmatter keys you want to track.
5. Click today's date in the Calendar sidebar. Start writing.

The system rewards consistency more than completeness. A half-filled entry every day is more valuable than a detailed entry once a week. The data compounds. The habits compound. The tool gets out of the way, which is all I really wanted from it.

Start smaller than you think. One folder. One template. A handful of fields. If a field does not change your behaviour or help you understand something later, delete it. Notes should earn their structure.

[^1]: Gruber, J. (2004). [Introducing Markdown](https://daringfireball.net/2004/03/introducing_markdown). Daring Fireball. Original announcement and design rationale for Markdown.

[^2]: GitHub. (2017). [GitHub Flavored Markdown Spec](https://github.github.com/gfm/). Notes Markdown's origin with John Gruber and Aaron Swartz and documents GitHub's Markdown dialect.

[^3]: KPBS / Associated Press. (2013). [Aaron Swartz, Reddit Co-Founder And Online Activist, Dead At 26](https://www.kpbs.org/news/2013/01/12/aaron-swartz-reddit-co-founder-and-online). Biographical context for Swartz's internet activism and Reddit co-founder role.

[^4]: Android Authority. (2016). [WhatsApp text formatting](https://www.androidauthority.com/whatsapp-text-formatting-680598/). Early coverage of WhatsApp's symbol-based bold, italic, strikethrough, and monospace formatting.

[^5]: Colne Talk. (2019). [Facebook group post formatting](https://colnetalk.co.uk/blog/facebook-group-post-formatting/). Notes Facebook group post formatting features around headings, lists, quotes, bold, and italics.
