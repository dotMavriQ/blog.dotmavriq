---
title: "MCP, Yeah, You Know Me"
pubDate: 2026-02-24
excerpt: "What even is an MCP? A breakdown of the Model Context Protocol and an honest look at whether these integrations are worth the security trade-offs."
tags: [MCP, Developer, AI]
heroImage: "/blog/dotBlog_MCPyeahyouknowme.png"
draft: false
---

You down with MCP? Yeah, you know me.

Or do you? Because for a protocol that's been hyped as the "USB-C for AI" over the past year and a half, there's a staggering number of developers who've connected MCP servers to their tools without ever really stopping to think about what they just plugged in. So let's fix that.

## So what IS an MCP?

**MCP** stands for **Model Context Protocol**. It was released as an open-source standard by Anthropic in late 2024 and has since been adopted by Google, Microsoft, OpenAI, and others. The idea is simple: it's a standardized way for AI applications (like Claude, Cursor, or any LLM-powered tool) to connect to external services, tools, and data sources.

Before MCP, every integration between an AI tool and an external service required custom code. Want Claude to talk to Slack? Write a custom integration. Want it to read your Figma designs? Another custom integration. Want it to manage your Linear tickets? You get the idea. N models times M tools equals N*M bespoke integrations.

MCP standardizes this into a client-server protocol. A tool developer builds one MCP server, and any MCP-compatible AI client can plug into it. Build once, connect many. It defines how tools should describe themselves (name, parameters, what they do) and provides a transport layer for the LLM to actually invoke them.

Think of it as a plugin system for AI. Your LLM client connects to one or more MCP servers, each of which exposes a set of "tools" the AI can call. The AI reads the tool descriptions, decides when to use them based on your prompts, and calls them as needed.

## The ones I've actually used

In my day-to-day work with Claude Code, I have access to a bunch of MCP servers. Here's an honest rundown of the ones I've actually used and what I think of them:

### Figma

The Figma MCP is genuinely useful. When someone shares a Figma URL, Claude can pull the design context, grab screenshots, read component metadata, and even generate code from the design. That said, it's not *there* yet. You're not going to prompt your way to a pixel-perfect 1:1 reproduction, sometimes not even close. Your mileage depends heavily on how the designer set up their file. The more their layout, naming, and component structure adheres to patterns that AI can actually parse, the better the output. A messy Figma file in, a messy component out. But when the stars align it does save a real step in the design-to-code workflow.

### Google Tag Manager

I ended up using this for opening up my GTM containers and creating tags, all without having to poke around in the menus. And it actually pulled off what I wanted. Niche, sure, but for whatever it's worth I could definitely see this being a productivity booster if you let it be. Just practice a hefty amount of caution. This is your analytics infrastructure.

### HubSpot

Yeah, no. I wanted to leverage this to verify that the things I'd set up in GTM were actually bringing data in the right way. Turns out there's no support for that. What it *can* do is search and manage CRM objects, look up contacts, deals, owners, and properties. Basically the bread and butter of navigating HubSpot without having to navigate HubSpot. I haven't found a real use for it yet, but if you spend a lot of time in the CRM it might click for you.

### Linear

This one is one of my favorites. Instead of diving between menus and all the various views that any given org puts up, you can just have AI sift through the API and fetch whatever is assigned to you or that has a specific label. Huge timesave. You can then have it read the `Issue` and actively help you resolve it, and that `Issue` becomes the context until it's done. Sometimes I'll have several tabs open with Linear `Issues` sitting in Claude until people get back to me and confirm that my work is good to close.

### Notion

I've used this to update databases with data from places I've asked Claude to non-destructively SSH into and gain insights about. And that's about as impressive as it gets as far as I'm concerned. I use it to bounce insights and data from various areas into readable documentation. It proves really useful on occasion.

### Slack

This one almost makes Slack bearable. *Almost.* Searching inside of Slack is a notorious pain. Even if you have a set order and structure, other people will deviate from that, which is precisely why I created the [Slactac](https://github.com/dotMavriQ/slactac) browser extension... but I digress. Having an AI that can read channel history and threads without you leaving the terminal is handy for catching up on what was discussed about a ticket or deployment without opening yet another Electron app. I've used it to send messages too, though I'll admit there's something slightly unnerving about an AI composing messages on your behalf in a work chat.

### Webflow

Being that Webflow has a high potential to be annoying, I was hoping this one would be cool. I got asked to switch out a HubSpot iFrame. Well, it ended up linking Claude to talk to Webflow's own AI in order to find answers... after having softboiled tokens for a minute or so it eventually told me that I should just "do it myself." However, I could leverage it to ensure that said iFrame was nowhere else on the site without relying on the shoddy search functionality. So there's that at least.

## They're more secure now, but...

Here's where things get interesting. Anthropic now provides many of these MCP integrations as first-party, built-in connections for Claude. That's a significant improvement over the wild west of community-built MCP servers that defined the early ecosystem. First-party means Anthropic has vetted the integration, controls the code, and presumably applies some security standards.

But "more secure" is not "secure." And the fundamental risks of the MCP architecture remain, regardless of who built the server.

## The security elephant in the room

[Simon Willison](https://simonwillison.net/) identified what he calls the **"Lethal Trifecta"** that makes MCP dangerous when three things combine:

1. **Access to private data** (your files, emails, databases)
2. **Exposure to untrusted content** (any input an attacker can influence)
3. **Ability to externally communicate** (send data outward)

MCP encourages users to mix and match tools from different sources, making it trivially easy for all three to coexist in one agent session. Connect a file-reading MCP, a web-browsing MCP, and an email MCP, and you've built yourself a perfect exfiltration pipeline.

[Invariant Labs](https://invariantlabs.ai/) demonstrated **tool poisoning attacks** where malicious instructions are embedded in MCP tool descriptions, invisible to the user but readable by the LLM. In their demo, a seemingly innocent "random fact of the day" MCP server contained hidden instructions that, when connected alongside a WhatsApp MCP server, silently exfiltrated the user's entire chat history to an attacker-controlled number.

[CyberArk](https://www.cyberark.com/) published research titled "Poison everywhere: No output from your MCP server is safe," showing that any data returned by an MCP tool can contain prompt injection payloads.

And then there's the **rug pull** problem: MCP tools can mutate their own definitions after installation. A tool that looks safe on Day 1 can be silently updated to become malicious by Day 7. The spec doesn't enforce immutability.

## What Maximilian Schwarzmuller thinks

[Maximilian Schwarzmuller](https://maximilian-schwarzmueller.com/), codefluencer (I did his Kubernetes course once!), has been a consistent voice of reason on MCP. His critique isn't even primarily about security, it's about whether the whole thing is *necessary*.

In his article ["Looking Beyond the Hype,"](https://maximilian-schwarzmueller.com/articles/whats-the-mcp-model-context-protocol-hype-all-about/) he makes the point that you don't need MCPs to make tools available in LLM-powered applications. MCP standardizes an already-existing capability. It doesn't introduce anything revolutionary.

He's also raised three specific problems:

- **Context Pollution**: Adding numerous MCP servers saturates the model's context with tool metadata, paradoxically making the AI *less* capable rather than more effective.
- **Unreliable Tool Usage**: AI systems either fail to use available MCP tools or require explicit instructions to employ them.
- **Unnecessary for Development**: Tools like Cursor already include web search, browser automation, CLI interaction, and git integration without MCP.

His podcast episode bluntly titled ["Use Agent Skills, NOT MCP"](https://code-curiosity-maximilian-schwarzmueller.podigee.io/70-agent-skills-beat-mcp) sums up his position: MCP has been hyped for over a year, but you can safely ignore it as a developer.

He's not wrong. But he's also not entirely right.

## The honest value assessment

Here's where I land on it. MCP servers *do* provide value. I've used them. They save context switches, reduce friction, and let you stay in flow when you'd otherwise be bouncing between six browser tabs. The Figma integration alone has saved me real time on real projects.

But here's what you should ask yourself before connecting any MCP server:

**Does this integration actually save me meaningful time, or am I just connecting it because it's there?**

Because the alternative, in most cases, is just... asking your LLM about the thing and then going to do it yourself. "Hey Claude, what should the GTM tag configuration look like for this event?" and then going to GTM and setting it up. That takes maybe two minutes longer than having the MCP do it directly, and it doesn't require granting an AI system access to your production analytics infrastructure.

The security risks are not theoretical. They're demonstrated. Tool poisoning, prompt injection through tool outputs, silent definition mutation, supply chain attacks through malicious packages posing as legitimate MCP servers, these have all been shown to work in practice.

## The research says...

There's actual academic work on this now. A study by Gloaguen et al., ["Evaluating AGENTS.md"](https://arxiv.org/abs/2602.11988) (which also sparked a [Hacker News discussion](https://news.ycombinator.com/item?id=47034087)), found that these repository-level context files that everyone's been writing tend to *reduce* task success rates compared to providing no context at all, while also increasing inference cost by over 20%. Developer-written ones showed a marginal 4% improvement. LLM-generated ones actually made things worse.

Then there's ["SkillsBench"](https://arxiv.org/abs/2602.12670) by Xiangyi Li et al., which benchmarked agent skills across 86 tasks in 11 domains. Curated skills boosted performance by 16.2 percentage points on average, but self-generated skills provided no benefit at all. The kicker: 2-3 focused, minimal skill modules outperformed comprehensive documentation every time.

The pattern is the same one we keep seeing with MCP. More isn't better. Focused and deliberate beats broad and bloated. And auto-generated anything tends to make things worse, not better.

[Theo](https://www.youtube.com/@t3dotgg) (this guy makes me want to try the [Dutch paracetamol ice-cream](https://www.dogrula.org/en/fact-checks/is-paracetamol-infused-ice-cream-sold-in-the-netherlands/) on a weekly basis) covered these findings in [a recent video](https://www.youtube.com/watch?v=GcNu6wrLTJc) if you'd rather watch than read papers.

## The bottom line

MCP servers *do* provide value. I've used them. They save context switches, reduce friction, and let you stay in flow when you'd otherwise be bouncing between six browser tabs. But every MCP server you connect is a door you're opening. And not every door needs to be open for you to get your work done.

Ask yourself: *Does the convenience justify the access I'm granting?* Sometimes the answer is yes. Sometimes the answer is "I could just open Slack in a browser tab."

Be down with MCP if it makes sense. But maybe don't be down with *every last homie* that shows up claiming to be an MCP server.
