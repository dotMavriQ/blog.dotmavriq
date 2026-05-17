---
title: '"AI" - A Retrospective, Part III: Where the Leverage Is Now'
pubDate: 2026-05-17
excerpt: "The practical end of the series: the productivity gains that are real, the traps that remain, and how serious developers should use LLMs now."
tags: [AI]
heroImage: "/img/blog/ai-retrospective.webp"
draft: false
series: "ai-retrospective"
seriesTitle: '"AI" - A Retrospective'
part: 3
partsTotal: 3
---

<div class="series-intro">
  <p class="series-kicker">Part III of III</p>
  <p class="series-label">Series</p>
  <ol class="series-links">
    <li><a href="/blog/ai-a-retrospective/">Part I: Genealogy</a></li>
    <li><a href="/blog/ai-a-retrospective-part-2/">Part II: The Confidence Game</a></li>
    <li><span aria-current="page">"AI" - A Retrospective, Part III: Where the Leverage Is Now</span></li>
  </ol>
  <p class="standfirst">Part II spent most of its energy on the political and structural critique. This part is what to actually do with the tools on Monday morning, given how fast the underlying landscape moved in April.</p>
  <p class="standfirst">The short version: price-per-capability collapsed, open weights caught up enough to matter, and the working developer's leverage now lives almost entirely in how well they route work between models and how disciplined their agent loops are.</p>
</div>

## The May 2026 landscape

Three things happened in the last month that materially change how a working developer should think about model choice.

DeepSeek released [DeepSeek V4](https://simonwillison.net/2026/apr/24/deepseek-v4/) on April 24 at €0.13 input and €3.20 output per million tokens for the Pro variant, with a launch promo running 75% below list through the end of May.[^deepseek-v4] It posts 80.6% on SWE-Bench Verified, supports a 1M-token context, and ships under an open-weights licence.[^deepseek-bench] At those numbers the model sits roughly one-sixth the price of Claude Opus 4.7 and GPT-5.5 at near-frontier capability. The frontier itself has not been closed, but the gap that previously justified the cost has been compressed hard, and the compression came from outside the Western lab cluster.

The open-weights tier filled in at the same time. Alibaba's [Qwen 3.6 Max-Preview](https://codersera.com/blog/best-open-source-llm-2026-llama-4-qwen-3-5-deepseek-v4-gemma-4-mistral/) leads six major coding and agent benchmarks including SWE-Bench Pro and Terminal-Bench 2.0. Meta's Llama 4 Scout pushed the open-weights context window to 10M tokens. Moonshot's Kimi K2.6, Zhipu's GLM-5.1, and Mistral Medium 3.5 all crossed into the open-weight frontier in the same window. There is now a credible open option in essentially every category a working SWE cares about: long-context reading, agentic edits, code completion, summarisation.

On the closed side, [GPT-5.5](https://www.buildfastwithai.com/blogs/gpt-5-5-review-2026) (April 24, €4.60 / €27.60 per million tokens) is the first fully retrained base model since GPT-4.5 and is built around agentic execution. [Claude Opus 4.7](https://ssntpl.com/gpt-5-5-review-2026-benchmarks-and-pricing/) (April 16, €4.60 / €23) leads SWE-Bench Verified at 87.6%. Gemini 3.1 Pro at €1.85 / €11 delivers comparable reasoning at roughly 60% of the GPT-5.5 cost.

The honest summary is that a developer in May 2026 is no longer choosing between paying the frontier rate and giving up quality. Open weights handle most of the work most of the time. The frontier models are still worth paying for on the hard end of the curve, but they should account for a much smaller share of total token volume than was true even six months ago.

## The Mythos tell

For readers who have not been tracking this, on April 7 Anthropic announced [Claude Mythos](https://techcrunch.com/2026/04/21/unauthorized-group-has-gained-access-to-anthropics-exclusive-cyber-tool-mythos-report-claims/), a model it described as too dangerous to release publicly.[^mythos] Mythos is said to discover zero-day vulnerabilities across major operating systems and browsers and to chain software bugs into multi-step exploits previously achievable only by skilled human teams. Access is gated through Project Glasswing, a roughly forty-company consortium of tech firms, financial institutions, and government stakeholders. An unauthorised group reportedly accessed it through a third-party vendor environment on the same day the announcement went out, by guessing Anthropic's URL conventions.

The security framing is plausible on paper. What independent testing has been published so far complicates it. The UK AI Security Institute's own assessment of Mythos Preview describes it as "a step up over previous frontier models in a landscape where cyber performance was already rapidly improving", and explicitly notes that the expert-level capture-the-flag tasks it excels at lack active defenders, defensive tooling, or penalties for triggering alerts, so the results cannot be read as evidence that Mythos would actually break well-defended systems.[^aisi-mythos] On the published head-to-head benchmarks, Mythos beats Opus 4.7 on SWE-Bench Verified (93.9 vs 87.6) and leads on the CyberGym vulnerability benchmark by 15 to 19 points, but on general reasoning (GPQA Diamond) the gap is 94.6 vs 94.2: effectively tied with the model Anthropic already sells to anyone with a credit card.[^mythos-bench] In other words, Mythos is meaningfully sharper than Opus 4.7 inside one narrow capability band, and roughly the same model everywhere else.

The surrounding numbers are more interesting still.

OpenAI has spent the last twelve months in visible distress. Reported internal documents project a roughly €13 billion loss for 2026 with potential insolvency by 2027 under current capex. Sam Altman conceded publicly that the GPT-5 rollout was "screwed up" and that subsequent point releases degraded writing quality further.[^altman-gpt5] DeepSeek's pricing forced a defensive cut, Anthropic has been pulling enterprise spend away for several quarters, and in January 2026 OpenAI started testing ads inside ChatGPT alongside an ad-free paid tier.[^openai-ads]

Read in that context, Mythos looks less like a careful safety decision and more like a positioning move. Anthropic clearly burned significant compute on a model substantially stronger than what either of them ships to general consumers, and then chose to monetise it through a controlled, high-margin enterprise channel rather than mass distribution. The security argument is real enough to defend in public, but the operative motivator is almost certainly the spreadsheet. OpenAI's ad-tier experiment is the same instinct expressed from the opposite side: when the consumer business stops scaling cleanly, the labs go looking for an in, and "elite enterprise capability priced accordingly" is the most credible one currently on the table.

That is the version I find more plausible than the surrounding theories about safety governance, capability overhang, or an imminent "AGI moment". Anthropic just got there first.

But I digress. Most of you are not here for lab strategy. You are here to ship.

## What actually works, and what is just opinion

The advice that gets posted on LinkedIn and X is mostly opinion in a confident voice. Some of it is worth following anyway. Very little of it has a number attached. So this section separates the two, because pretending otherwise is the cringe I want to avoid.

**Four things are actually measured.**

**1. Scope the task and write down the acceptance condition.** The 2023 GitHub Copilot study found a 55.8% speedup on a defined implementation task.[^1] The 2025 METR study found a 19% slowdown when experienced developers used AI tools inside repositories they already had cached, while reporting they felt faster.[^2] Both results are real and both point at the same boundary. AI helps when the task has a clear shape, an acceptance condition you can write in a sentence, and a verification loop you can run. It hurts when you already know the answer faster than you can supervise the model. A 2026 meta-analysis of generative AI in programming lands in the same practical place: gains exist, gains are context-dependent.[^3]

**2. The verification loop has to be cheaper than the generation loop.** This is the load-bearing rule. Bender et al. established the structural claim that the system does not know what is true, and Apple's GSM-Symbolic paper showed up to 65% performance collapse on the addition of a single irrelevant clause.[^bender2][^gsm-ref] Together those results mean every saving you make on generation is paid back as time spent verifying. Working tests, fast type-check, lint-on-save, a `make verify` under thirty seconds. If checking the model's output takes longer than typing the code yourself, the model is not helping you on that task.

**3. Narrow the tool surface.** Simon Willison's "lethal trifecta" (private data + exposure to untrusted content + the ability to communicate outward in the same session) is the cleanest published description of how agents leak in production.[^trifecta] Filesystem, test runner, and a git interface cover most work. Add Slack, browser, deploy, and analytics only when the task genuinely calls for them.

**4. Lean context beats fat context.** The "lost in the middle" research shows that long-context models systematically under-use information placed in the middle of the window, and most provider documentation acknowledges that context-window saturation degrades performance in practice.[^lost-middle] Prune aggressively, reference files instead of pasting them, and resist the temptation to throw the whole codebase at the model "just in case." A focused 8K-token prompt routinely beats a sloppy 200K-token one on the same task.

**The next five are opinion.** I find them consistently useful in my own work but cannot point to a controlled study for any of them, so flag them accordingly.

**5. Project context file.** A `CLAUDE.md`, `AGENT.md`, or equivalent at the repo root describing architecture, naming, invariants, and the test command. Industry consensus, no published measurement. If the model keeps misreading the codebase, the codebase is poorly explained.

**6. Plan before edit.** Get a written plan before any file is touched. Rejecting a bad plan costs one round-trip. Rejecting a bad diff costs the round-trip plus a `git reset` plus the cognitive damage of having half-read the wrong changes.

**7. Route by task.** Frontier (Opus 4.7, GPT-5.5) for architectural judgement and ambiguous tickets. Open-weight near-frontier (DeepSeek V4 Pro, Qwen 3.6 Max-Preview) for mechanical edits, long-context reads, and most agentic loops. Local (Qwen 3.5, Gemma 4) for privacy-sensitive chores. Paying frontier rates for a regex migration is a tax on inattention.

**8. Reset when the context goes sideways.** If the agent has been wrong three times in a row, the conversation is poisoned. Start clean rather than fighting through. Cheaper than the alternative every time.

**9. Read every diff and watch for terminology drift.** Skim-reviewing model output is how you become the person who ships subtly-renamed concepts. A model that quietly turns `Customer` into `Client`, or `subscription` into `plan`, in summaries and PR descriptions will erode the shared vocabulary your team works with. The model has no stake in keeping your labels stable.

The honest summary: the advice with citations attached is short. The advice without citations is longer. Anyone selling the long version as the rigorous version is selling something.

## What to pay for in May 2026

My personal stack stays intentionally small, and the April price shake-up made the split easier.

Pay for one frontier workhorse subscription. The honest picture as of writing is uglier than it was a month ago. Claude Opus 4.7 was the default for coding-heavy work, but the launch has been followed by a sustained wave of regression complaints: lazy multi-file edits, early-stopping behaviour (declaring a task done well before the acceptance condition is met), degraded instruction-following, and visibly increased hedging. The New Stack has framed it as "AI shrinkflation", the same product name running on materially less compute per query, and AMD's AI director, quoted by The Register, called Claude Code "dumber and lazier".[^opus-nerf] The most-upvoted Reddit thread on the release is titled, plainly, "Opus 4.7 is not an upgrade but a serious regression". GPT-5.5 sits in the same job slot if you live closer to the agent-orchestration end of the spectrum, with the launch baggage already covered above.

I am personally looking over my shoulder. DeepSeek V4 Pro is what I expect to route most of my work through over the coming months, with Opus 4.7 held in reserve for the genuinely ambiguous-judgement tasks until either the regression is acknowledged and fixed, or DeepSeek closes the remaining gap on the hard end of the curve. Subscription sprawl beyond one frontier seat plus an open-weight provider is still how developers recreate cable TV inside their toolchain.

Use an open-weight near-frontier model through a cheap API or local inference for the other 80%. DeepSeek V4 Pro, Qwen 3.6 Max-Preview, and Gemini 3.1 Pro all sit at the price/capability point where you can stop counting tokens. The launch promo on V4 Pro through end of May is worth using just to recalibrate how cheap "good enough" has become.

Keep at least one local model installed and warm. Qwen 3.5, Gemma 4, or a quantised DeepSeek variant via Ollama or LM Studio is enough for privacy-sensitive chores, offline work, and the kind of low-risk repetitive throughput where round-tripping to a hosted API is the slow part.

The split keeps incentives clean. No tiny task should feel like it costs money. No high-risk decision should land on the cheapest model just because it was convenient.

## The craft still matters

AI makes fundamentals more important, not less.

A weak developer with a strong model can produce more code than before. That is not the same as producing better software. A strong developer with a strong model can move faster because they know what to reject, what to simplify, and what the model is missing.

This is why I still spend deliberate time writing without assistance. When I learn a language outside my main lane, I type the code. Lua, Kotlin, whatever has my attention at the time. No agent scaffolding. Minimal autocomplete. The point is not purity. The point is keeping the muscles that let me supervise the machine.

The photographer comparison still holds for me. Smartphones did not end photography; they destroyed the old credibility signal of merely owning the gear. LLMs are doing the same thing to ordinary code production. The thing that used to mark a developer as competent, namely the ability to make working code appear on a screen, has been commodified, and the credibility has moved into everything that surrounds the production.

That judgment includes taste, debugging discipline, architecture, security instinct, and knowing when the slower path is the correct path.

## Where I would bet now

If I were advising a serious developer in 2026, I would give a boring list. Learn agentic tooling properly: the file-edit loop, the test loop, the review loop, and the failure modes. Write better project documentation; a good `README`, clear architecture notes, and a concise agent context file improve both human onboarding and model output. Keep one differentiated technical bet outside the most model-saturated stacks: TypeScript and Python will stay economically strong but the tooling is best there because the training data is richest there, and specialist judgement in Kotlin, Elixir, Zig, Clojure, Rust, OCaml, or another serious ecosystem is still a hedge against becoming one more interchangeable prompt operator. Build local competence even if local models are not your daily driver. Measure outcomes; "more output" is not the same as "better throughput."

## The current position

The mass-market LLM layer is not the whole story of AI. The serious scientific programme (AlphaFold's protein-structure work which earned Hassabis and Jumper half of the 2024 Nobel Prize in Chemistry,[^4] DeepMind's GNoME materials catalogue,[^5] GraphCast's weather-forecasting results[^6]) is plainly consequential and deserves its own category of respect.

The thing in our editors is more modest and more immediate. It is a stochastic interface for moving through software work. Sometimes it is brilliant, sometimes it is a liar with great formatting, and the correct response is neither awe nor contempt. The correct response is disciplined use.

As of right now, the developers who learn that discipline are eating well. Not because the model replaces their skill, but because it gives their skill a longer handle. They can inspect more, try more, compare more, automate more, and reserve more attention for the decisions that actually matter.

The ones who have not stepped into the tooling yet are not morally wrong. They are just working without a lever that their peers are already learning to aim.

That is where I land after the hype, the critique, and the daily use: use the tools where they pay rent, distrust the theatre around them, and keep doing the parts of the work that are still yours.

Series:
1. [Part I: Genealogy](/blog/ai-a-retrospective/)
2. [Part II: The Confidence Game](/blog/ai-a-retrospective-part-2/)
3. `"AI" - A Retrospective, Part III: Where the Leverage Is Now`

[^deepseek-v4]: Willison, S. (2026). [DeepSeek V4 — almost on the frontier, a fraction of the price](https://simonwillison.net/2026/apr/24/deepseek-v4/).
[^deepseek-bench]: Codersera. (2026). [DeepSeek V4 Pro: 80.6% SWE-Bench, $3.48/M Output (List)](https://codersera.com/blog/deepseek-v4-pro-review-benchmarks-pricing-2026/).
[^mythos]: Whittaker, Z. (2026). [Unauthorized group has gained access to Anthropic's exclusive cyber tool Mythos, report claims](https://techcrunch.com/2026/04/21/unauthorized-group-has-gained-access-to-anthropics-exclusive-cyber-tool-mythos-report-claims/). TechCrunch. See also Built In, [Claude Mythos: Why Anthropic Won't Release Its New AI Model](https://builtin.com/articles/anthropic-claude-mythos).
[^aisi-mythos]: UK AI Security Institute. (2026). [Our evaluation of Claude Mythos Preview's cyber capabilities](https://www.aisi.gov.uk/blog/our-evaluation-of-claude-mythos-previews-cyber-capabilities). Notes caveats on isolated CTF tasks lacking active defence and alert penalties.
[^mythos-bench]: NxCode. (2026). [Claude Opus 4.7 vs 4.6 vs Mythos: Which Model Should You Use?](https://www.nxcode.io/resources/news/claude-opus-4-7-vs-4-6-vs-mythos-which-model-2026). Aggregates published Mythos vs Opus 4.7 benchmark deltas (SWE-Bench Verified, GPQA Diamond, CyberGym).
[^altman-gpt5]: Vincent, J. (2025). [Sam Altman admits OpenAI 'totally screwed up' GPT-5 launch and says the company will spend trillions of dollars on data centers](https://fortune.com/2025/08/18/sam-altman-openai-chatgpt5-launch-data-centers-investments/). Fortune. See also coverage of subsequent GPT-5.2 writing-quality issues.
[^openai-ads]: Reported January 2026 testing of an ad-supported free tier alongside an ad-free paid tier inside ChatGPT; treated by analysts as a classic monetisation pivot under revenue pressure.
[^1]: Peng, S. et al. (2023). [The Impact of AI on Developer Productivity: Evidence from GitHub Copilot](https://arxiv.org/abs/2302.06590).
[^2]: METR. (2025). [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/).
[^3]: Maier, S., Gunzenhäuser, M., Schweisthal, J., Schneider, M., Feuerriegel, S. (2026). [A meta-analysis of the effect of generative AI on productivity and learning in programming](https://arxiv.org/abs/2605.04779). Submitted 6 May 2026. Reports a statistically significant but moderate positive effect on developer productivity across 23 studies; no significant effect on learning outcomes.
[^bender2]: Bender, E. M., Gebru, T., McMillan-Major, A., Shmitchell, S. (2021). [On the Dangers of Stochastic Parrots](https://dl.acm.org/doi/10.1145/3442188.3445922). FAccT '21.
[^gsm-ref]: Mirzadeh, I. et al. (2024). [GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models](https://arxiv.org/abs/2410.05229). ICLR 2025.
[^trifecta]: Willison, S. (2025). [MCP: The lethal trifecta](https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/).
[^lost-middle]: Liu, N. F. et al. (2023). [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172). Transactions of the ACL.
[^opus-nerf]: See coverage at The New Stack, [AI shrinkflation: Why Anthropic's Claude Opus 4.7 may be less capable than the model it replaced](https://thenewstack.io/claude-opus-47-flaky-performance/); BuildFastWithAI, [Claude Opus 4.7 Regression Explained (2026)](https://www.buildfastwithai.com/blogs/claude-opus-4-7-regression-explained-2026); and DevToolPicks, [Claude Opus 4.7 Is a Regression: Why Developers Are Switching Back to 4.6](https://devtoolpicks.com/blog/claude-opus-4-7-regression-switching-back-to-4-6-2026). The Reddit thread titled "Opus 4.7 is not an upgrade but a serious regression" passed 2,300 upvotes within 48 hours of launch; The Register quoted AMD's AI director describing Claude Code as "dumber and lazier".
[^4]: The Royal Swedish Academy of Sciences. (2024). [The Nobel Prize in Chemistry 2024](https://www.nobelprize.org/prizes/chemistry/2024/summary/).
[^5]: Merchant, A. et al. (2023). [Scaling deep learning for materials discovery](https://www.nature.com/articles/s41586-023-06735-9). Nature.
[^6]: Lam, R. et al. (2023). [Learning skillful medium-range global weather forecasting](https://www.science.org/doi/10.1126/science.adi2336). Science.
