---
title: '"AI" - A Retrospective, Part II: The Confidence Game'
pubDate: 2026-04-17
excerpt: "The models are useful. The marketing around them is not honest. This is the part about confident wrongness, fear-driven hype, captured voices, and the surveillance bargain behind mass-market LLMs."
tags: [AI]
heroImage: "/img/blog/ai-retrospective.webp"
draft: false
series: "ai-retrospective"
seriesTitle: '"AI" - A Retrospective'
part: 2
partsTotal: 3
---

<div class="series-intro">
  <p class="series-kicker">Part II of III</p>
  <p class="series-label">Series</p>
  <ol class="series-links">
    <li><a href="/blog/ai-a-retrospective">Part I: Genealogy</a></li>
    <li><span aria-current="page">"AI" - A Retrospective, Part II: The Confidence Game</span></li>
    <li><a href="/blog/ai-a-retrospective-part-3">Part III: Where the Leverage Is Now</a></li>
  </ol>
  <p class="standfirst">The models are useful enough that pretending otherwise is unserious. The marketing around them is dishonest enough that accepting it at face value is worse.</p>
  <p class="standfirst">The chatbot-conquers-mankind discourse is mostly a distraction from the real problems already in the room: inaccurate output sold as intelligence, unstable products sold as infrastructure, fear sold as inevitability, and a data bargain far more intimate than anything Web 2.0 managed to normalise.</p>
</div>

## The artefact does not know what is true

Two findings worth stating up front, because the rest of this part assumes them.

First, the systems we are discussing do not reason in the way the marketing implies. Bender and colleagues' 2021 ["stochastic parrots"](https://dl.acm.org/doi/10.1145/3442188.3445922) paper named the core observation that large language models manipulate statistical regularities in their training data rather than meaning, and generate fluent output without any internal model of what is true.[^bender] Apple researchers sharpened that result in 2024 with the [GSM-Symbolic](https://arxiv.org/abs/2410.05229) paper, which showed that current LLMs (including the most capable closed and open systems tested) cannot perform genuine logical reasoning. Adding a single clause to a maths problem that looked relevant but contributed nothing to the answer caused performance drops of up to 65% across state-of-the-art models, consistent with probabilistic pattern-matching rather than formal logic.[^gsm-symbolic] Neither of those is an anti-AI paper. They are sober descriptions of what the artefact is.

Second, large social, commercial, and military systems are increasingly treating these models as if they could discern what is true. The Moffatt v. Air Canada ruling in early 2024 forced a Canadian tribunal to formally reject the airline's argument that a hallucinating chatbot was a separate legal entity responsible for its own statements, after the bot invented a refund policy that did not exist.[^air-canada] At the other extreme of consequence, +972 Magazine's investigation into the Israeli army's "Lavender" system reported that an AI classifier had marked roughly 37,000 Palestinians as suspected militant targets, with human analysts spending around twenty seconds verifying each label (often only checking whether the name was that of a man) against a known error rate of approximately 10%.[^lavender] The range of consequences runs from "a Canadian court hands you a few hundred euros" to "people are killed because a probability score said so."

These two facts, that the artefact does not know what is true and that institutions are routing high-stakes decisions through it anyway, are the substrate the rest of this part rests on. The confidence game, the marketing dishonesty, the surveillance-grade extraction, the Neo-Pravda enclosure, and the agent blast radius are all downstream of treating a pattern-matcher as an authority.

## The product is confidence

The defining defect of mass-market LLMs is that they fail in the same tone they succeed in. Every tool is wrong somewhere, but most tools at least tell you when: a compiler explodes, a test fails specifically, a database constraint rejects the write and explains itself. An LLM, by contrast, can invent a library, misread a legal clause, reverse a security recommendation, or fabricate a citation while preserving the surface texture of competence.

The interface turns uncertainty into fluent prose, which leaves the user to supply the missing epistemology and decide what is known, what is guessed, and what must be verified. That verification work is the work.

A Stanford and Berkeley paper in 2023 measured behavioural drift between the March and June versions of GPT-4 and GPT-3.5.[^1] Methodology arguments aside, the lesson held: hosted models are changing services behind a stable product name. When a dependency changes behaviour I get a version bump; when a model changes behaviour the average user gets vibes, forum threads, and a support page written in brand language.

## The lies are mostly ordinary

The worst AI marketing is ordinary business dishonesty with better demos.

The demos show the happy path, the launch posts show the benchmark, the keynotes show the agent completing the task. The missing slide is the one with the review burden, the failure rate, the prompt retries, the cleanup pass, the legal exposure, and the engineer who now spends half the afternoon checking whether the machine lied.

McDonald's ended its IBM-powered AI drive-through pilot in 2024 after public failures made the system look exactly like what it was, a brittle automation layer dropped into a noisy human environment.[^2] Upwork's 2024 research found that 77% of employees using generative AI said the tools had added to their workload while executives kept expecting the opposite.[^3] Klarna pushed an AI-heavy customer-service story, then began rehiring humans into support roles and acknowledged that quality had suffered;[^4] Duolingo's AI-first memo produced a similar public correction cycle in 2025.[^5]

The replacement story keeps outrunning the operating facts. The public gets the productivity claim before the organisation has paid the verification cost. That is innovation theatre with the bill for technical and operational debt arriving later, off-stage.

## Fear keeps the machine warm

The hype cycle no longer runs only on wonder. It runs on fear.

Fear that your company will be left behind, that your competitor will automate faster, that your job will disappear, that your kid will be disadvantaged if they do not use the tool, that your country will lose the next industrial race.

Fear is useful because it shortens due diligence. A team that thinks it is making a normal software purchase asks about data handling, rollback, audit logs, and total cost. A team that thinks history is about to run them over asks how fast they can sign.

That is why so much AI marketing is written in the grammar of inevitability: you are invited to accept the future, not to evaluate a tool.

The geopolitical layer reinforces that framing. CHIPS Act funding, GPU export controls, Stargate-style infrastructure announcements, and the China-facing anxiety around DeepSeek and Qwen all feed the same public mood of AI as industrial policy with a consumer subscription attached.[^6] Once a technology is framed as national destiny, ordinary criticism starts sounding like disloyalty, which is convenient for the companies selling it.

## The firebrands get folded in

The marketing apparatus does not stop at official keynotes. It moves through the people the developer world already listens to: YouTubers, X personalities, newsletter writers, conference speakers, podcast hosts, open-source maintainers, benchmark thread authors. The category needs loud interpreters because most buyers cannot evaluate the systems directly, and the platforms those interpreters live on reward certainty rather than calibration. Some of those voices are sincere and doing useful work. Others are visibly changing their stated position every few months because the affiliate link, sponsor slot, or audience growth is better when the next tool is treated as the new centre of the universe. That does not make them uniquely corrupt, only part of the same incentive structure as the labs, the tool vendors, the platforms, and the conferences that need cultural distribution, credibility, novelty, conflict, and thumbnails respectively.

This is why I trust boring operator notes more than performance certainty. Show me the workflow, the failure, the diff, what the tool broke, what you stopped using after two weeks. The honest review is usually less exciting than the sponsored one, which is exactly why it matters.

## From Web 1.0 to Web 2.0

The data argument needs some history, because otherwise it turns into vague privacy concern.

Web 1.0 was the older web of homepages, forums, blogs, and strange little sites you found by following links. It was not innocent. Servers logged visits, ad networks existed, cookies existed. But the default relationship was still closer to visiting someone else's place than living inside a platform's behavioural machine. Owning or renting a domain meant something, and even when the design was awful, the boundaries were legible.

Web 2.0 turned the user into both participant and raw material, organised around feeds, social graphs, likes, and the "web as platform" idea.[^7] This was the era that taught the internet to mine consumption needs at scale: not only what you bought, but what you hovered over, what made you angry, what kept you scrolling, what you searched after midnight. The familiar ethical complaints (behavioural advertising, dark patterns, recommendation systems that learn human weakness faster than human preference) all live here. Web 2.0 sold us to the highest bidder by learning our behaviour. The LLM layer wants more.

## The assistant wants the inside of your head

Mass-market LLM services are interfaces for thinking, planning, asking, drafting, confessing, debugging, and deciding, which makes the data qualitatively different from earlier internet products. A social network has to infer that you are anxious from what you read and when. A chatbot can be told directly. An assistant ends up reading the CV draft, the salary negotiation, the private fear that you are falling behind, the plan you have not told your employer, and on the coding side the half-written migrations, the credentials accidentally left in local files, and the questions a developer asks when they do not yet understand their own system.

OpenAI's own privacy writing pitches memory as useful because ChatGPT can remember important people, projects, and topics you ask about.[^8] It is a good product feature, and the clearest possible description of the surveillance direction: persistent, personalised, context-rich modelling of the user. The prize is your cognitive profile, not just your attention. Web 2.0 had to infer much of that from behaviour. Assistant-era AI asks you to type it in.

## The extraction gets more precise

A system that knows your habits, budget stress, family structure, political anxieties, health concerns, and emotional state does not merely know which ad to show. It knows which offer you are likely to accept, which friction you will tolerate, and which moment is best for the ask. Your operating system, browser, workplace, documents, calendar, messages, and searches all become more useful when connected to it; each connection is easy to justify in isolation, and together they form a map of a person more detailed than anything the old social feed could produce. Exporting your data is not the same as exporting the model's familiarity with you. That is the lock-in: the assistant becomes valuable because it has watched you think.

## Neo-Pravda

In the Soviet Union, [*Pravda*](https://en.wikipedia.org/wiki/Pravda) was the official newspaper of the Communist Party, published from 1912 onward and serving for most of the twentieth century as the central organ of state truth. The word itself means "truth", which is part of the joke and part of the design. *Pravda* did not need to lie about everything. It needed to be the venue where the story was told, the photographs were chosen, the names were named or quietly removed, and the past was edited to support the present. Other publications existed, but the canonical version of events ran through one door, and the door was owned by the people who benefited most from the version that came out of it.

The reason to raise this in 2026 is that the current public posture toward AI systems quietly reconstructs the same arrangement in a new language. The reigning maxim is that we, as users, cannot really know what the algorithms do, that the inner workings are too complex, the training data too vast, the emergent behaviour too mystical to audit in any meaningful way. That framing sounds like humility. It functions as an enclosure. Once we accept that the box is unknowable, the operators of the box become the only people authorised to tell us what is inside it, what it produced, why it produced it, and what we should take from the output. The mystery is the moat.

The clearest small demonstration was the [David Mayer incident](https://techcrunch.com/2024/12/03/why-does-the-name-david-mayer-crash-chatgpt-digital-privacy-requests-may-be-at-fault/) in late 2024, when ChatGPT silently refused to produce that name (among a handful of others) and broke off mid-response or returned an error.[^david-mayer] OpenAI attributed it to an internal filter that had misfired, and that explanation may well be true. The instructive part is that it could just as easily not have been, and the cover story was indistinguishable from a real bug. That is the new operational reality: the people running the box can shape what it says, plead ignorance in the language of "model behaviour", and be believed by default, because the alternative is to demand transparency that the framing has already declared impossible.

What we are subscribing to, every time we route more of our reading, research, drafting, and decision-making through these systems, is trust in a handful of multinational conglomerates to not skew their outputs toward their own commercial interests, to report findings accurately even when accuracy is unprofitable, to refrain from quietly rewriting history in favour of the parties who can afford to influence the rewrite, and to surface information without privileging the worldview of whichever government or shareholder happens to be exerting the most pressure that quarter. The track record of those same companies on every previous version of that question is on the public record, and it is not a flattering record.

In terms of how resources and influence are actually distributed, the AI assistant era is far closer in shape to a [feudal system](https://en.wikipedia.org/wiki/Feudalism) than to either Web 1.0 or Web 2.0. The early web, for all its commercial messiness, was a network of independently published things you could read directly. Web 2.0 turned the user into the raw material, but the user could at least see the platform, name it, criticise it, and in principle leave it. The AI assistant layer is different in kind. It places a small number of providers between a person and almost every cognitive task that person performs, and it does so through an interface that feels like a private conversation. The lord owns the mill, the lord owns the language in which you describe your problems to the mill, and the lord remembers what you said last week.

The stakes are larger than the previous generation of internet harms, and a lot of the existing reflexes do not cover them. Self-hosting your blog, blocking ads, opting out of behavioural advertising, lobbying for platforms to bear responsibility for what they amplify, running your own mail server: still good, still worth doing, and no longer the right scale of response on their own. The thing being signed over here goes well past your timeline, your inbox, and your shopping profile. It reaches every interconnected aspect of the way you think, work, and decide, channelled through a system whose ultimate optimisation target is more money, more market power, and more political influence for its owners, with your data and your attention as both the fuel and the collateral.

We have, by now, more than enough proof that these companies act first and ask questions later. The FTC has already been investigating surveillance pricing, where personal data is used to set individualised prices for the same goods or services.[^9] Sitting here believing that the same playbook will not, given the opportunity, extend through an assistant layer that knows you far more intimately than any retailer ever could, quietly surfacing higher quotes, longer wait times, or thinner service to whoever the model predicts will be unprofitable, is far too naive. The same inferential shape does not stop at price tags. It is the shape that quietly removes a candidate from a shortlist, denies a promotion, declines an insurance policy, sets a worse rate on a mortgage, narrows the reach of a voice in public discourse, deprioritises a medical request, or rejects a rental application before a human ever reads the file. Believing that the companies that have fought to keep this style of inference legal at the social-media layer will suddenly become principled about it at the assistant layer is the most generous reading on offer, and it is too generous.

And we do not even need to blame the corporations to find the harm. We are already using these tools to undermine ourselves. Students cheat on exams at a scale that will visibly thin the next generation's academic preparedness. Companies trust AI to filter candidates, which pushes those candidates to use AI back, leaving the human side of hiring stuck in a confused middle. The technology is already a disruptor at more layers of life than it can credibly serve.

Arrangements of that shape historically do not stay politely in the background. It is worth naming the shape early, while there is still room to negotiate the terms.

## Agents increase the blast radius

The agent layer turns the concern from profiling into action. A chatbot can leak what you paste into it; an agent can read files, browse pages, post messages, edit code, call APIs, and move data between systems. Simon Willison's "lethal trifecta" remains the cleanest description of the risk: private data, exposure to untrusted content, and the ability to communicate outward in the same session.[^10]

MCP and similar integration layers are useful and I use them. The danger is the casual permission bundle (Slack, GitHub, filesystem, browser, email, deployment, analytics) which turns the model into a junior operator with a memory problem and tool access. The right posture is boring: fewer integrations, narrower permissions, explicit review before outbound actions, and a hard distinction between "the model may draft" and "the model may do."

## The critique has to stay grounded

The honest critique is that useful systems are being wrapped in a dishonest story. The models are inaccurate in ways the interface hides, the products unstable in ways the branding hides, the economics worse than the subscription price implies, and the data bargain far more intimate than the public has metabolised. That is enough without fantasy doomsday rhetoric on top.

I use the tools because they work, but I do not grant the companies selling them the benefit of the doubt just because the demo is impressive. Use the leverage, distrust the theatre, and treat every new convenience as a request for access.

Part III is where that leaves a working developer right now.

Continue with [Part III: Where the Leverage Is Now](/blog/ai-a-retrospective-part-3).

Series:
1. [Part I: Genealogy](/blog/ai-a-retrospective)
2. `"AI" - A Retrospective, Part II: The Confidence Game`
3. [Part III: Where the Leverage Is Now](/blog/ai-a-retrospective-part-3)

[^bender]: Bender, E. M., Gebru, T., McMillan-Major, A., Shmitchell, S. (2021). [On the Dangers of Stochastic Parrots: Can Language Models Be Too Big? 🦜](https://dl.acm.org/doi/10.1145/3442188.3445922). FAccT '21.
[^gsm-symbolic]: Mirzadeh, I. et al. (2024). [GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models](https://arxiv.org/abs/2410.05229). ICLR 2025. Apple Machine Learning Research.
[^air-canada]: Moffatt v. Air Canada, 2024 BCCRT 149. See Pinsent Masons. (2024). [Air Canada chatbot case highlights AI liability risks](https://www.pinsentmasons.com/out-law/news/air-canada-chatbot-case-highlights-ai-liability-risks). The tribunal rejected as a "remarkable submission" Air Canada's argument that the chatbot was a separate legal entity.
[^lavender]: Abraham, Y. (2024). ['Lavender': The AI machine directing Israel's bombing spree in Gaza](https://www.972mag.com/lavender-ai-israeli-army-gaza/). +972 Magazine and Local Call. The investigation reports approximately 37,000 Palestinians marked, an estimated 20-second human review per target, and a stated error rate around 10%.
[^1]: Chen, L., Zaharia, M., Zou, J. (2023). [How is ChatGPT's behavior changing over time?](https://arxiv.org/abs/2307.09009).
[^2]: Lucas, A. (2024). [McDonald's ending test of AI-powered drive-thru with IBM](https://www.cnbc.com/2024/06/17/mcdonalds-ending-ai-drive-thru-ibm.html). CNBC.
[^3]: Upwork Research Institute. (2024). [From Burnout to Balance: AI-Enhanced Work Models](https://www.upwork.com/research/ai-enhanced-work-models).
[^4]: Barnert, J.-P. (2025). [Klarna Turns to Humans Again After AI Cost Cuts Miss the Mark](https://www.bloomberg.com/news/articles/2025-05-08/klarna-turns-to-humans-again-after-ai-cost-cuts-miss-the-mark). Bloomberg.
[^5]: von Ahn, L. (2025). [On Duolingo's approach to AI](https://www.linkedin.com/posts/luisvonahn). LinkedIn.
[^6]: OpenAI. (2025). [Announcing The Stargate Project](https://openai.com/index/announcing-the-stargate-project/).
[^7]: Britannica. [Web 2.0](https://www.britannica.com/topic/Web-20).
[^8]: OpenAI. (2026). [How ChatGPT learns about the world while protecting privacy](https://openai.com/index/how-chatgpt-protects-privacy/).
[^david-mayer]: Coldewey, D. (2024). [Why does the name 'David Mayer' crash ChatGPT? OpenAI says privacy tool went rogue](https://techcrunch.com/2024/12/03/why-does-the-name-david-mayer-crash-chatgpt-digital-privacy-requests-may-be-at-fault/). TechCrunch. Other names that triggered the same behaviour included Brian Hood, Jonathan Turley, Jonathan Zittrain, David Faber, and Guido Scorza.
[^9]: Federal Trade Commission. (2024). [Surveillance Pricing](https://www.ftc.gov/news-events/features/surveillance-pricing).
[^10]: Willison, S. (2025). [MCP: The lethal trifecta](https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/).
