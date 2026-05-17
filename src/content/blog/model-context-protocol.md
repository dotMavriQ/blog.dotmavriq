---
title: "Model Context Protocol"
pubDate: 2026-02-24
excerpt: "What MCP is, where I used it, where it bites, and the rule I ended up with."
heroImage: "/img/blog/model-context-protocol.svg"
tags: [MCP]
draft: false
---

The [Model Context Protocol](https://modelcontextprotocol.io/) has been a hot topic for a moment now, so I figured I'd write a bit about it and the experiments I've been running with different MCP servers.

I've used them as part of my actual job for months. They are genuinely useful. They are also worth understanding properly before pointing them at your work accounts.

## What the protocol actually does

MCP stands for **Model Context Protocol**. Anthropic released it as an open-source standard in late 2024.[^launch] Google, Microsoft, OpenAI, and most of the surrounding AI infrastructure companies have adopted it since. The idea is small and obvious in retrospect: a standardised way for AI applications (Claude, Cursor, or any LLM-powered tool) to connect to external services, tools, and data sources.

Before MCP, every integration between an AI tool and an external service was bespoke. N models multiplied by M tools meant N times M custom integrations, each of them ageing on its own schedule. MCP collapses that into a client-server protocol. A tool author writes one MCP server. Any MCP-compatible client can plug into it. Build once, connect many.

The protocol describes how tools introduce themselves (name, parameters, capabilities) and provides a transport layer the model uses to invoke them. The mental model is a plugin system. Your client connects to one or more MCP servers, each of which exposes a set of tools the model can call. The model reads the descriptions, decides when to use them based on what you typed, and invokes them as needed. That last sentence is where both the convenience and the risk live.

## Using MCP at Nordhealth

At [Nordhealth](https://nordhealth.com/), I folded several MCP integrations into my daily workflow with Claude Code. These are the ones I used long enough to have a genuine opinion about. The header on each section links out to the server itself, in case you want to try them.

### [Figma](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Dev-Mode-MCP-Server)

The Figma MCP is genuinely useful. When someone shares a Figma URL, Claude can pull design context, grab screenshots, read component metadata, and generate code from the design. It is not pixel-perfect. Output quality depends heavily on how the designer structured the file. Clean naming, consistent component hierarchies, and well-organised layers produce better results. A messy file in, a messy component out. When the source file is well-structured, the MCP removes a real step from the design-to-code workflow.

### [Linear](https://linear.app/docs/mcp)

Linear became my most-used integration. Instead of navigating its various views and menus, I let Claude query the API for issues assigned to me or tagged with specific labels. The real value is that the issue itself becomes the working context. Claude reads it, helps resolve it, and that context persists until the work is done. I regularly had multiple Claude sessions running against different Linear issues until reviewers signed off. It felt less like "AI project management" and more like keeping the ticket pinned to the side of the workbench.

### [Slack](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)

Searching inside Slack is a well-documented pain point, which is part of why I built the [Slactac](https://github.com/dotMavriQ/slactac) browser extension. Having a model that can read channel history and threads without leaving the terminal is useful for catching up on a deployment conversation or the trail of context behind a ticket. It can send messages as well, but that is the part I started doing manually after a while. An AI drafting a message into a work channel is fine. An AI sending one without me reading it character by character is not. In practice that meant I let the MCP read Slack as much as it wanted, and I copied the draft into Slack myself when it was time to actually post.

### [Google Tag Manager](https://github.com/stape-io/google-tag-manager-mcp-server)

I used this for opening GTM containers and creating tags without touching the UI. Niche but it delivered. If you live in GTM, it cuts real friction. The caveat is the obvious one: this is your analytics infrastructure. Proceed with appropriate caution.

### [Notion](https://github.com/makenotion/notion-mcp-server)

I used this to push structured data into Notion databases, turning notes from SSH sessions and other tools into readable documentation. Useful on occasion, not transformative.

### [HubSpot](https://developers.hubspot.com/mcp)

I connected this hoping to verify that GTM data was flowing correctly into HubSpot. That is not what it does. It searches and manages CRM objects: contacts, deals, owners, properties. Essentially HubSpot navigation without HubSpot's interface. If you spend significant time in the CRM, it could be valuable. For my use case it was not.

### [Webflow](https://developers.webflow.com/data/docs/ai-tools)

I needed to swap out a HubSpot iframe on a Webflow site. The integration was not particularly helpful for the actual task. It did let me verify that the iframe was not embedded elsewhere on the site, which Webflow's own search handles poorly. Limited utility for what I needed.

## Security concerns

The security risks of MCP are not theoretical. Several research groups have demonstrated them on shipped tooling.

[Simon Willison](https://simonwillison.net/) wrote up what he calls the **lethal trifecta**, the combination that makes any agent dangerous when three properties coexist in one session.[^3]

1. Access to private data: files, emails, databases.
2. Exposure to untrusted content: any input an attacker can influence, including web pages a model is allowed to fetch.
3. Ability to communicate outward: anything that sends data away from the host.

MCP encourages mixing tools from different sources, which makes it remarkably easy for all three to coexist by accident. Connect a file-reading MCP, a web-browsing MCP, and an email-sending MCP, and you have built an exfiltration pipeline you did not mean to build.

[Invariant Labs](https://invariantlabs.ai/) demonstrated **tool poisoning attacks**, where malicious instructions are embedded in MCP tool descriptions that are invisible to the user but readable by the model. In their demo, a benign-looking "random fact of the day" server contained hidden instructions that, when connected alongside a WhatsApp MCP server, silently exfiltrated the user's entire chat history to an attacker-controlled number.[^4]

[CyberArk](https://www.cyberark.com/) published research titled "Poison everywhere: No output from your MCP server is safe," showing that any data returned by a server can carry prompt injection payloads.[^5]

There is also the **rug-pull problem**. MCP tools can mutate their own definitions after installation. A tool that looks safe on day one can be silently updated to do something else entirely by day seven. The specification does not enforce immutability.

Anthropic now provides many MCP integrations as first-party, built-in connections for Claude. First-party means Anthropic has vetted the integration, controls the code, and applies security standards consistently. That is a real improvement over the early community-server free-for-all. The architectural risks remain regardless of who built the server.

## The counter-argument

[Maximilian Schwarzmuller](https://maximilian-schwarzmueller.com/) has been one of the more consistent voices arguing that MCP solves a problem developers do not actually have. In ["Looking beyond the hype"](https://maximilian-schwarzmueller.com/articles/whats-the-mcp-model-context-protocol-hype-all-about/) he points out that MCP standardises a capability that already exists in other forms. Nothing fundamentally new is being introduced.[^6]

He raises three specific concerns:

- **Context pollution.** Adding numerous MCP servers saturates the model's context with tool metadata, which can make the AI less capable rather than more.
- **Unreliable tool usage.** Models either fail to use available MCP tools or need explicit prompting to use them at all.
- **Unnecessary for development.** Tools like Cursor already include web search, browser automation, CLI interaction, and git integration without MCP.

His podcast episode ["Use Agent Skills, NOT MCP"](https://code-curiosity-maximilian-schwarzmueller.podigee.io/70-agent-skills-beat-mcp) is blunter: MCP has been hyped for over a year and developers can safely ignore it.[^7]

He is not wrong on the specifics. The trajectory still matters. Adoption is rising, the specification is maturing, and first-party integrations keep raising the security floor. Dismissing MCP entirely may age poorly.

## What the research shows

Academic work is starting to land. Gloaguen et al.'s [Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988) found that repository-level context files tend to reduce task success rates compared to providing no context at all, while increasing inference cost by over 20%. Developer-written context files produced a marginal 4% improvement. LLM-generated ones made things worse.[^1]

[SkillsBench](https://arxiv.org/abs/2602.12670) by Xiangyi Li et al. benchmarked agent skills across 86 tasks in 11 domains. Curated skills boosted performance by 16.2 percentage points on average. Self-generated skills provided no benefit. The headline finding: two or three focused, minimal skill modules outperformed comprehensive documentation every time.[^2]

That matches what I saw in practice. More tools did not make the agent smarter. It usually made the session heavier. The MCP servers that helped me were the ones I reached for intentionally, for specific tasks, not the ones I had connected because they were available.

## Where I landed

MCP servers do provide value. I have used them, and they saved real time on real projects. The Linear and Figma integrations in particular cut context switching in a way that added up over a working week.

But every MCP server you connect is a door you open. Not every door in your house needs to be open for you to get your work done. The question worth asking before plugging anything in is whether the convenience justifies the access. Sometimes the answer is yes. Sometimes the honest answer is that you could just ask the model about the thing and go do it yourself.

I am not anti-MCP. I am anti-leaving every door in the house open because the handle happens to be standardised. Use it selectively, understand what each server can actually touch, and prefer fewer, well-vetted integrations over a maximalist setup.

[^launch]: Anthropic. (2024). [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol). Initial release announcement, November 2024.

[^1]: Gloaguen, R. et al. (2025). Evaluating AGENTS.md. arXiv:2602.11988. Also discussed on [Hacker News](https://news.ycombinator.com/item?id=47034087).

[^2]: Li, X. et al. (2025). SkillsBench: Evaluating Agent Skills Across 86 Tasks. arXiv:2602.12670.

[^3]: Willison, S. (2025). [MCP: The Lethal Trifecta](https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/). simonwillison.net.

[^4]: Invariant Labs. (2025). [MCP Security Notification: Tool Poisoning Attacks](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks). invariantlabs.ai.

[^5]: CyberArk. (2025). [Poison everywhere: No output from your MCP server is safe](https://www.cyberark.com/resources/threat-research-blog/poison-everywhere-no-output-from-your-mcp-server-is-safe). CyberArk Threat Research Blog.

[^6]: Schwarzmuller, M. (2025). [What's the MCP (Model Context Protocol) Hype All About?](https://maximilian-schwarzmueller.com/articles/whats-the-mcp-model-context-protocol-hype-all-about/). maximilian-schwarzmueller.com.

[^7]: Schwarzmuller, M. (2025). [Use Agent Skills, NOT MCP](https://code-curiosity-maximilian-schwarzmueller.podigee.io/70-agent-skills-beat-mcp). Code Curiosity Podcast, Episode 70.
