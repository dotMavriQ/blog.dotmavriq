---
title: '"AI" - A Retrospective, Part I: Genealogy'
pubDate: 2026-04-16
excerpt: "A working genealogy of the consumer LLM wave: the releases that hit the scene, how they were received, and what I actually used them for."
tags: [AI]
heroImage: "/img/blog/ai-retrospective.webp"
draft: false
series: "ai-retrospective"
seriesTitle: '"AI" - A Retrospective'
part: 1
partsTotal: 3
---

<div class="series-intro">
  <p class="series-kicker">Part I of III</p>
  <p class="series-label">Series</p>
  <ol class="series-links">
    <li><span aria-current="page">"AI" - A Retrospective, Part I: Genealogy</span></li>
    <li><a href="/blog/ai-a-retrospective-part-2/">Part II: The Confidence Game</a></li>
    <li><a href="/blog/ai-a-retrospective-part-3/">Part III: Where the Leverage Is Now</a></li>
  </ol>
  <p class="standfirst">The consumer LLM story is usually told as a straight capability curve. A bigger model lands, the benchmarks move, the internet yells for a week, and everyone pretends the previous release was obviously primitive.</p>
  <p class="standfirst">From inside actual work, the useful history is stranger and more practical than that. The models mattered, but interface, context windows, pricing, and the terminal all mattered alongside them. The moment a model became easy to fit into a real workflow usually mattered more than the launch-day benchmark table.</p>
</div>

## Before ChatGPT became the story

I was already poking at GPT-3 through the OpenAI API before ChatGPT arrived. That period now gets flattened into prehistory, but it is worth remembering properly. GPT-3 was not useless. It could summarise, continue text, draft boilerplate, and make enough strange mistakes to remind you that the thing was still fundamentally a completion engine.

The barrier was not only capability. It was ergonomics. You needed an API key, a playground, a sense for prompts, and enough curiosity to tolerate bad output. That kept the audience small. Developers played with it. Writers tried it. Most normal people did not.

The real cultural break came when the model moved into a chat box.

## ChatGPT, November 2022

ChatGPT hit the public internet on November 30, 2022. By early 2023 it had reached 100 million monthly users, which Reuters reported as the fastest consumer-app growth curve on record at the time.[^1] Stack Overflow banned ChatGPT-generated answers five days after launch because the site was being flooded with confident nonsense at a scale moderators could not absorb.[^2]

That was the first public shape of the category: amazement and garbage, both arriving together.

The buzz was not only tech press. It was everywhere. X filled with screenshots of prompts that looked like magic if you did not know what to test. Mainstream papers ran explainers. Schools panicked. Managers started asking whether this could write emails, reports, code, and probably their quarterly plans.

For me, ChatGPT first became useful around a WordPress plugin: the [TeamTailor Integrator](https://github.com/dotMavriQ/TeamTailor-Integrator-For-WordPress). Teamtailor's JSON:API response shape has a flat `data[]` list and a separate `included[]` list of relationship objects resolved by ID. My first helper for flattening that into WordPress-friendly data was a pile of nested PHP closures that made sense while I was writing it and became opaque fifteen minutes later.

GPT-3.5 could not safely rewrite the whole thing. It could read a sample payload and explain the relationship graph in plain English. That was enough. I used it less as a programmer and more as a documentation generator for an API whose shape was clearer in the response than in the docs.

That was the first durable lesson: the model did not need to be trusted with the final code to save real time.

## GPT-4, March 2023

GPT-4 landed in March 2023 with the first benchmark jump large enough to make the prior model feel meaningfully old. OpenAI reported GPT-4 scoring around the 90th percentile on a simulated Uniform Bar Exam, while GPT-3.5 had landed around the 10th.[^3] The exact bar-exam framing has been debated since, but the practical gap was obvious to anyone using both models.

The public conversation changed almost overnight. The Future of Life Institute published its pause letter the same month, calling for a six-month stop on training systems more powerful than GPT-4.[^4] Microsoft Research published *Sparks of Artificial General Intelligence*. The tone moved from "interesting chatbot" to "this might reshape knowledge work."

My test case was my Obsidian journaling setup, the one I later wrote up in [Structured Notes for Developers](/blog/structured-journaling-for-developers/). The plugin had a parser, an index, and a query layer that had grown together for long enough that responsibility boundaries were getting blurry.

I fed GPT-4 the files one by one, with enough orientation to explain how they interacted. I did not ask it to write a rewrite. I asked where responsibility was split incorrectly.

It pointed at index invalidation living inside parsing logic. That was the right call. Moving invalidation into a shared event path made later changes easier for months. GPT-3.5 had helped me read. GPT-4 was the first model I trusted for structural judgment, with review.

It also taught me the first hard limit of the era. The model could be sharp inside the context it had, and weirdly blind just outside it. Context discipline became part of the craft.

## Claude 2, July 2023

Claude 2 did not enter the room by beating GPT-4 at everything. It entered with a different product shape: a 100,000-token context window.[^5] At a time when the normal GPT-4 experience still meant much smaller windows for most users, that changed the work more than a small benchmark lead would have.

The online reaction was calmer than the ChatGPT and GPT-4 moments, but among developers the appeal was obvious. You could paste the whole thing. Not literally every repository, but enough of a project that the model could hold architecture instead of snippets.

That changed how I prepared context. I started keeping project notes in `context/` folders: schema quirks, deployment constraints, naming rules, decisions that looked arbitrary unless you knew the history. In 2025 everyone started calling some version of that file `CLAUDE.md`. The habit predates the name.

The useful test was review, not generation. For small personal projects, I would paste the README, relevant source files, and my own notes, then ask Claude for a system-level critique. The output was not always right. It was consistently better than the snippet-by-snippet workflow because it could notice repetition, drift, and mismatched concepts across files.

This was also where monorepo-style thinking started looking more valuable in an LLM workflow. The easier it is to present the whole shape of a system, the more leverage the model has.

## Claude 3 Opus and GPT-4 Turbo, early 2024

By early 2024 the default stopped being obvious. GPT-4 Turbo had brought larger context and lower API pricing. Claude 3 Opus arrived in March 2024 with benchmark results that made Anthropic feel like a true frontier competitor rather than the polite alternative.[^6]

That changed the public conversation again. On X, people stopped asking only "what did GPT-4 say?" and started comparing model personalities, refusal patterns, coding taste, and reasoning quality. The mainstream press mostly kept the race framing. Developers felt the more useful version: model choice had become a real workflow decision.

I tested that while planning the move of this site away from WordPress and toward Astro. The tradeoffs were concrete: editor ergonomics, deployment, image handling, RSS, canonical URLs, and what I would lose by leaving the WordPress admin behind.

I ran the same architectural questions through Opus and Turbo. Where they agreed, I treated it as a strong signal. Where they disagreed, I read both closely and checked primary sources.

Opus caught Turbo inventing an Astro adapter. Turbo caught Opus overstating the maturity of an image pipeline. The disagreement was the useful part. Two model outputs, read critically against each other, became a better review surface than either model alone.

That is still part of how I use these systems.

## Claude 3.5 Sonnet, June 2024

Claude 3.5 Sonnet was the first model that felt unfair at the price. Anthropic reported stronger coding and reasoning performance than Claude 3 Opus in several areas, while pricing it far below Opus.[^7] Artifacts also changed the chat interface from "answer in a box" into something closer to a working surface.

The public reception among developers was immediate. Cursor users, Claude users, and the terminal crowd all seemed to converge on the same opinion within days: Sonnet was the practical workhorse.

My strongest test was a Symfony 6.4 to 7.0 migration. Rector handled the ordinary conversion work, but the long tail still needed judgment: Doctrine annotations to PHP attributes, custom validators, entity listeners, embeddables, odd column mappings, and old code that had survived by being left alone.

Sonnet was the first model I could hand a full entity class with mixed annotation styles and get back an attribute conversion where the details mostly survived. I still reviewed everything. The difference was that review had become cheaper than first drafting.

It also became useful as a test designer. I would feed it a Messenger handler or a service boundary and ask for a matrix of cases: retries, idempotency, serializer edge cases, Doctrine failures mid-consume. The generated tests were often not the point. The matrix caught omissions.

## o1-preview, September 2024

OpenAI's o1-preview introduced a different kind of public product: a model that spent more inference-time compute on reasoning before answering.[^8] It was slower, more expensive, and often less convenient for ordinary coding. It was also much better at problems where the failure mode was not syntax but state.

The internet reception split fast. Some people treated it as proof that reasoning had arrived. Others hated the latency and the strange product feel. Both reactions made sense.

I used it on an authentication bridge between WordPress and Laravel. WordPress owned public content and subscriptions. Laravel owned the dashboard, tenant administration, and permission-heavy work. The hard part was not JWTs or Sanctum or roles. The hard part was the state machine: password resets, subscription lapses, logout propagation, role changes across active tabs, and two systems disagreeing about who the user was.

I gave o1-preview the constraint list, the capability matrix, and the rough flow. I asked it to enumerate the transitions where the systems could diverge.

It returned a list of edges, separated into safe, reconcilable, and structurally bad. The structurally bad ones forced the real decision: Laravel had to become the identity authority, with WordPress consuming that state.

That was the first time a model helped land an architectural decision I would have paid a consultant to review.

## DeepSeek, Gemini, and Qwen, 2025

DeepSeek V3 arrived at the end of 2024 with a reported training cost around €5 million, a number that landed like a brick because frontier training was widely assumed to require vastly larger budgets.[^9] R1 followed in January 2025 with open weights and reasoning performance that put real pressure on the closed labs.

The market noticed. Nvidia lost roughly €555 billion in market value in a single trading day after the DeepSeek reaction hit full force.[^10] That was not a normal model-launch news cycle. That was the hardware story, the closed-lab story, and the US-China story colliding in public.

For my own work, DeepSeek validated local inference as more than a hobby. I moved low-risk throughput to my HydroRigs setup: commit-message drafts, log triage, first-pass review, and boring summarisation. Frontier models stayed for work that needed them. Local models took the chores.

Google pushed from another angle. Gemini 2.5 Pro arrived in March 2025 with a 1-million-token context window, with Google describing 2 million as the next step.[^11] The public reaction was obvious: if Claude made "paste the project" plausible, Gemini made "paste the artifact nobody wants to split" feel normal.

That is exactly where it earned a place for me. Large controllers, generated API clients, migrations, ugly single files that should not exist but do. Gemini was strongest when the whole artifact needed to stay visible at once.

Qwen filled a different slot through Qwen Code and cheap CLI access. I used it for throwaway terminal work and third-opinion reads, not as the center of the stack. By 2025, that was the broader point. There was no single model story anymore. There was a routing story.

## Claude Code and the agent turn

Claude Code made the shift from answer generation to work execution feel normal. The model was not just replying. It was reading files, editing files, running tests, correcting itself, and carrying a task across more than one step.

This is where the category became serious for my day job. I wrote project context files with the same care I would give onboarding docs. I connected selective MCP surfaces where they made sense. I used agents for the parts of work that had previously died from context switching: audit this drift, write the ticket, prepare the diff, run the checks, leave me with the decision.

The most useful example has been standardising several WordPress production environments that share a theme but drifted over years of local fixes. The agent did not magically solve it. I still reviewed the drift, made the calls, and owned the changes. What changed was that the audit-to-ticket-to-PR loop became small enough to repeat.

That is the genealogy as I experienced it. Less a clean march toward artificial general anything, and more a sequence of releases where the work changed whenever capability, context, interface, and cost happened to line up at the same time.

Part II is where the accounting starts.

Continue with [Part II: The Confidence Game](/blog/ai-a-retrospective-part-2/).

Series:
1. `"AI" - A Retrospective, Part I: Genealogy`
2. [Part II: The Confidence Game](/blog/ai-a-retrospective-part-2/)
3. [Part III: Where the Leverage Is Now](/blog/ai-a-retrospective-part-3/)

[^1]: Hu, K. (2023). [ChatGPT sets record for fastest-growing user base](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/). Reuters.
[^2]: Stack Overflow Meta. (2022). [Temporary policy: Generative AI (e.g., ChatGPT) is banned](https://meta.stackoverflow.com/questions/421831/).
[^3]: OpenAI. (2023). [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774).
[^4]: Future of Life Institute. (2023). [Pause Giant AI Experiments: An Open Letter](https://futureoflife.org/open-letter/pause-giant-ai-experiments/).
[^5]: Anthropic. (2023). [Claude 2](https://www.anthropic.com/news/claude-2).
[^6]: Anthropic. (2024). [Introducing the next generation of Claude](https://www.anthropic.com/news/claude-3-family).
[^7]: Anthropic. (2024). [Claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet).
[^8]: OpenAI. (2024). [Learning to Reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/).
[^9]: DeepSeek-AI. (2024). [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437).
[^10]: Rennison, J., Lockett, H. (2025). [Nvidia sheds almost $600bn in market value as DeepSeek triggers US tech sell-off](https://www.ft.com/content/e670a4ea-05ad-4419-b72a-7727e8a6d471). Financial Times. (The headline figure is in USD; converted to roughly €555bn at then-current rates.)
[^11]: Google. (2025). [Gemini 2.5: Our most intelligent AI model](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/).
