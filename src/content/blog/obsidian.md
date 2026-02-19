---
title: "Obsidian (1/3)"
pubDate: 2024-01-03
excerpt: "My Obsidian setup and how it ties into everything else."
tags: [Productivity]
heroImage: "/blog/dotBlog_Obsidian.png"
draft: false
---

There are so many ways to get organized, aren't there?

## The productivity trap

People have been trying to capitalize on selling the single best universal solution that will make you an unstoppable force of productivity.

"No more procrastination, EVER!"

Yeah... I don't believe all that either.

And there are even things to be said about allowing your brain to be your primary filter in life. Whatever does not stick might simply not interest you enough.

However...

## Why journaling matters

There is nothing wrong at all with journaling. There's countless studies since time eternal pointing at the fact that it helps people with taking themselves more seriously and it also helps a whole lot with staying organized with all of the things that you don't have social or monetary incentives to do. There are a lot of those in life.

## The search for the right tool

I looked at several alternatives, got caught in the trappings of how niche and cool and geeky some things were, like [Org mode](https://en.wikipedia.org/wiki/Org-mode) for [Emacs](https://en.wikipedia.org/wiki/Emacs) (for all you hardcore programmers out there) or things like [Joplin](https://en.wikipedia.org/wiki/Joplin_(software)). I dabbled a fair bit with "wanting to blog" as if people wanted to read about me doing my laundry and crying in front of [Band of Brothers](https://en.wikipedia.org/wiki/Band_of_Brothers_(miniseries)) on a Saturday morning.

Eventually I found Obsidian.

## Obsidian is not perfect

It's not [Free and Open Source software](https://en.wikipedia.org/wiki/Free_and_open-source_software) by definition. It's attached to a subscription service owned by a private company. But they've admittedly had a good run and the people responsible are very invested in simply creating a product that lasts. And if you don't want to sync files using their service there's nothing to stop you from doing it on your own. Some people even use Git repositories!

And learning to take simple notes using the [Markdown](https://en.wikipedia.org/wiki/Markdown) language standard is what is the most important part of all this. Obsidian just so happens to allow users to have excellent visual improvements for the varying means with which we can format said documents.

## Making it my own

Obsidian HAS a well defined structure and an extensive "means to approach certain kinds of notes"... I found it easier to use this opportunity to program my own means of interacting and extracting value from my notes. That project became ~~Obsitica~~ Habsiad!

## What is Habsiad?

[Habsiad](https://github.com/dotMavriQ/Habsiad) is my Obsidian plugin. It's a bridge between Obsidian and [Habitica](https://habitica.com/), the gamified habit tracker. But calling it just a bridge sells it short. It's really a full productivity suite that sits inside Obsidian and gives structure to daily journaling.

The core idea is simple: Habitica is great at tracking habits, dailies, and to-dos. But it doesn't store your progress over time. You check things off and they vanish. Habsiad fixes that by pulling your completed habits and dailies from Habitica into your Obsidian journal entries, where they become permanent records you can actually look back on and visualize.

And here's the thing: you don't even need Habitica to use it. Habsiad works just fine on its own with its built-in Retrotagger, which lets you manually log your habits and dailies directly inside any journal entry.

## How I use it day to day

Every morning I open today's journal note (more on how that works below) and it's already templated with sections for work, food tracking, to-dos, and reflections. Throughout the day I fill things in as they happen.

At the end of the day I hit `Ctrl+Shift+H` and Habsiad pulls in everything I checked off in Habitica. Meals tracked, workout done, steps logged, book reading noted. All of it lands in my journal as structured data stored in the frontmatter.

That frontmatter is key. It turns qualitative "I had a good day" entries into quantitative data I can graph over weeks and months.

### What you can track

Out of the box, Habsiad supports tracking:

- **Habits and Dailies** from Habitica (or manually via the Retrotagger)
- **Steps** from whatever fitness app you use (Google Fit, Samsung Health, Zepp Life, etc.)
- **Weight** in kilograms for trend tracking
- **Calories** with automatic summation from meal tables in your notes
- **Alcohol consumption** by scanning for drink-related emojis in your entries
- **Anything you want** via the Labels system, where you tag things with emojis like `🧇: 8` or `🌡️: 22` and Habsiad aggregates the data

### Labels

This is probably my favorite feature. You can track literally anything by putting an emoji and a number anywhere in your journal entry:

```
* Indoor temperature today `🌡️: 22`
* Glasses of water `💧: 8`
* Pages read `📖: 45`
```

Habsiad scans all your entries and gives you a chronological rundown of any label you click on. No setup, no configuration. Just write naturally and the data shows up.

### Logs

Another one I use constantly. You can create specialized logs using Obsidian's callout syntax:

```
> [!DREAM] #### The underwater one again
> Navigating some tunnel underwater with people from high school...

> [!WORKOUT] #### Morning run
> 5K in 25 minutes. Felt decent despite the rain.
```

Habsiad collects all logs of the same type across your journal and presents them chronologically. Great for dream journals, workout logs, meeting notes, whatever pattern you want to track over time.

## The plugins that make it all click

Habsiad doesn't exist in a vacuum. There are three community plugins that I consider essential companions.

### Calendar

The [Calendar plugin](https://github.com/liamcain/obsidian-calendar-plugin) by Liam Cain puts a simple calendar in your sidebar. Click any date and it opens (or creates) that day's journal note. It's the front door to the whole journaling workflow. Without it you'd be manually creating files named `2024-01-03.md` every day, and nobody wants that.

### Tracker

The [Tracker plugin](https://github.com/pyrochlore/obsidian-tracker) by pyrochlore is what turns all that frontmatter data into graphs. All those values Habsiad stores (steps, weight, habits completed, calories, custom labels) become line charts, bar graphs, and summaries. This is where the long-term payoff lives. Weeks of daily logging suddenly become visible trends.

### Emoji Toolbar

The [Emoji Toolbar plugin](https://github.com/oliveryh/obsidian-emoji-toolbar) by oliveryh makes the Labels feature actually practical. Instead of hunting for the right emoji every time you want to log something, you get a quick picker. Small quality of life thing, but it matters when you're trying to make journaling as frictionless as possible.

## Why I built it

I built Habsiad because I wanted one place where everything about my day could live. Not scattered across five apps. Not locked behind some service's API. Just Markdown files on my computer that happen to be really well structured.

The fact that it bridges to Habitica is a bonus for people who like the [gamification](https://en.wikipedia.org/wiki/Gamification) angle. But the real value is in the journal structure, the data it captures, and the fact that it's all yours, stored locally, forever.
