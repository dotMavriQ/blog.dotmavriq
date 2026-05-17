---
title: "Cognitive Load Theory"
pubDate: 2025-04-04
excerpt: "Your brain is a battery. Plan accordingly."
tags: [Productivity]
heroImage: "/img/blog/cognitive-load-theory.png"
draft: false
---

Unproductive days are rarely about laziness or discipline. You slept fine, you ate, nothing went visibly wrong, but the brain will not cooperate. I used to treat those days as a character flaw and try to bully my way through them. That mostly produced worse work and a worse mood. "Push through it" misidentifies the problem. The problem is capacity, and capacity is a real, finite, measurable constraint.

Your brain is a battery. That is most of the thesis, and the rest is housekeeping.

## Cognitive load as a resource constraint

[Cognitive Load Theory](https://en.wikipedia.org/wiki/Cognitive_load) was developed by [John Sweller](https://en.wikipedia.org/wiki/John_Sweller) in the late 1980s as a framework for instructional design.[^2] The core claim is small and inconvenient: [working memory](https://en.wikipedia.org/wiki/Working_memory) has a hard limit, roughly four chunks of information at a time.[^1] Exceed that limit and performance degrades. Learning stops. Decision quality drops. You can take or leave the framework. The ceiling is still there either way.

The framework splits that load into three buckets:

- **Intrinsic load** is the inherent difficulty of the task. Some problems are genuinely hard. Not reducible.
- **Extraneous load** is unnecessary friction around the task. Bad tooling, disorganized files, unclear instructions, searching for a bookmark saved three months ago. Reducible.
- **Germane load** is the productive effort directed at learning and understanding. The one worth maximizing.[^2]

The relationship is zero-sum within a fixed capacity. Every unit of extraneous load displaces a unit of germane load. That is the part I care about in day-to-day work: friction is not just annoying. It is stealing room from the thing I am actually trying to think about.

## The cumulative cost of small decisions

The drain is rarely one large event. It is the boring accumulation of small choices spread across the day.

An unorganized desktop. Forty-seven browser tabs from three different tasks. An inbox full of unread email. A bookmarks folder that functions as a graveyard. None of these are difficult individually. Each one demands a small decision, a small search, a small moment of retrieval. Research on [decision fatigue](https://en.wikipedia.org/wiki/Decision_fatigue) shows that the aggregate cost of minor decisions measurably degrades the quality of subsequent decisions.[^3]

The same thing happens in code. A repository with no README, inconsistent naming, and tests that live in three different directories is extraneous load for every developer who touches it. A CI pipeline that takes fifteen minutes to surface an error on line 40 is extraneous load. An onboarding process that lives entirely in one person's head is extraneous load. Nobody sees the full cost because it is paid in tiny installments, but the bill is still real.

## The basics still matter

This part is obvious, which is usually why people ignore it.

A fixed folder structure eliminates the decision of where to save something. Browser bookmarks should function as a reference library, not a graveyard of aspirational links. Email filters separate signal from noise at the point of arrival, not at the point of reading. [Keyboard shortcuts](https://en.wikipedia.org/wiki/Keyboard_shortcut), terminal aliases, and text expansion snippets compound over hundreds of repetitions per day. Disabling non-urgent notifications converts a phone from an interrupt source into a tool.

None of this is new advice. I am not pretending bookmarks and aliases are a personality. The point is that each one is a tiny reduction in extraneous load, and the aggregate effect is larger than any individual cleanup suggests.

## Where it matters in engineering practice

The more interesting applications are in how teams work. Your desktop is your problem. A team's messy process becomes everyone else's problem too.

### Ticket hygiene

A well-written ticket is load reduction for everyone who touches it. The title states the problem. The description includes reproduction steps, expected behavior, and acceptance criteria. Screenshots and logs are attached, not described from memory. A ticket that says "fix the login bug" forces the next person to spend twenty minutes figuring out what you meant. That is extraneous load transferred from the writer to the reader. It does not disappear. It moves.

The same applies to pull requests. A PR with a clear description of what changed and why, scoped to a single concern, is faster to review than a 40-file diff with "various fixes" as the title. Code review quality degrades when the reviewer has to hold too much context at once. Smaller, well-described PRs are not a style preference. They are a capacity management strategy.

### Documentation as load reduction

The best documentation answers the question someone is about to ask, at the moment they are about to ask it. A runbook next to the alert definition. A decision record next to the architectural choice. An API reference generated from the code rather than maintained separately. Documentation gets worse the further it lives from the thing it explains.

A wiki nobody searches is not load reduction. It is load deferral. The question still gets asked, the interruption still happens, and now someone has to context-switch to answer it. Documentation should earn its placement.

### Environment consistency

Every difference between a developer's local environment and production is extraneous load waiting to surface. Containerized dev environments, shared dotfile configurations, pinned dependency versions, reproducible builds. These are not perfectionism. They eliminate an entire category of "works on my machine" debugging that burns capacity on problems that have nothing to do with the actual work.

### Meeting discipline

Every meeting is a context switch for every attendee. Every context switch carries a recovery cost. Research on [attention residue](https://en.wikipedia.org/wiki/Attention_residue) shows that even after returning to a task, part of your attention remains on the previous context.[^4]

An agenda distributed before the meeting reduces the intrinsic load of participation. A written summary afterward means nobody has to hold the outcomes in working memory. A meeting that could have been an async message is extraneous load multiplied by the number of attendees.

## Offloading to external systems

Working memory holds roughly four items.[^1] Mine does not become more noble just because I am busy.

Technology has no such constraint.

A calendar reminder does not forget. A [cron job](https://en.wikipedia.org/wiki/Cron) does not get tired. A well-organized note system does not lose track of things after a long week. The principle is the same one that drives good software architecture: do not store in memory what belongs on disk.

Writing things down, setting reminders, automating repeatable tasks. These are not crutches. Working with a known constraint beats pretending it does not exist. Pretending working memory stretches further than it does is how you end up staring at a screen at 15:00 with no recollection of what you were supposed to be doing.

## Planning around capacity

The battery metaphor is useful because capacity is predictable enough to plan around.

If cognitive performance peaks in the morning, that is when demanding work belongs. Code review, architecture decisions, debugging complex state. Email, administrative tasks, and low-stakes communication fit the afternoon when capacity is lower. Some days are consistently rougher. Mondays carry weekend context loss. Fridays carry a week of accumulated load. The schedule should reflect that rather than fight it.

Rest is not a reward for productivity. It is maintenance. I am bad at remembering this when work is interesting, which is exactly when it matters. Preventive maintenance is cheaper than failure recovery. Waiting until cognitive capacity is fully depleted before resting is the equivalent of waiting for an engine to seize before checking the oil.

## Kill the extraneous load first

Working memory is limited. Extraneous load is controllable. Most of the useful improvement lives in that gap, and most of it is unglamorous.

Handle the small things before they accumulate. Write the ticket properly the first time. Keep the dev environment clean. Document the decision while the reasoning is still fresh. The capacity freed up is the capacity available for the work that actually matters.

Treat your attention the way you treat any other limited resource you depend on. Budget it. Spend it on the right things. Stop pretending it is infinite. The brain you are using to read this is the same brain you will have at the end of the day, and you only get one of them per day.

[^1]: Cowan, N. (2001). The magical number 4 in short-term memory: A reconsideration of mental storage capacity. Behavioral and Brain Sciences, 24(1), 87-114. https://doi.org/10.1017/S0140525X01003922

[^2]: Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257-285. https://doi.org/10.1207/s15516709cog1202_4

[^3]: Baumeister, R. F., & Tierney, J. (2011). Willpower: Rediscovering the Greatest Human Strength. Penguin Press.

[^4]: Leroy, S. (2009). Why is it so hard to do my work? The challenge of attention residue when switching between work tasks. Organizational Behavior and Human Decision Processes, 109(2), 168-181. https://doi.org/10.1016/j.obhdp.2009.04.002
