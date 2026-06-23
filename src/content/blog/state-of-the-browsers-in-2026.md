---
title: "State of the Browsers in 2026"
pubDate: 2026-01-17
excerpt: "I wanted to stay a Firefox person. The web kept punishing me for it, and eventually I stopped pretending I was holding the line."
heroImage: "/img/blog/state-of-the-browsers-in-2026.webp"
tags: [Digital Freedom]
draft: false
---

I wanted to stay a Firefox person.

That sentence is the entire argument, written as a confession. Chrome is the web now, which is annoying to put in writing because it sounds like surrender and also happens to be true. It holds roughly 70% of global usage.[^1] Every other mainstream browser except Firefox and Safari runs on Chromium. Google controls [Blink](https://en.wikipedia.org/wiki/Blink_(browser_engine)). Google controls [V8](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)). Google sets the pace for what the web is allowed to do and how quickly it is allowed to do it.

The remaining counterweight is [Gecko](https://en.wikipedia.org/wiki/Gecko_(software)), and Gecko belongs to [Firefox](https://en.wikipedia.org/wiki/Firefox). That makes Firefox structurally important even when Firefox is privately frustrating, and it makes the decision to stop using it feel different from the decision to stop using almost any other tool. You can leave a text editor without anyone losing anything. The web does not work that way.

## How Chrome quietly became the default

Chrome first overtook Internet Explorer as the world's most-used browser in 2012.[^2] By the late 2010s, that lead had become the gravity well of professional web work. The teams I worked with debugged in Chrome DevTools by reflex. Bug reports arrived with Chrome screenshots. QA reproduced issues in Chrome first. Client sites were judged by how they behaved in Chrome because that was where the users were.

I kept Firefox around privately the whole time. I wanted the separation. Chrome for work, Firefox for me. But the web kept making that distinction expensive in small ways. A checkout flow that behaved strangely. A video player that stalled. An internal dashboard that worked in Chrome and misbehaved just enough in Firefox to cost an afternoon. None of these failures were dramatic on their own. They were small nudges, repeated for years, until opening Chrome stopped feeling like a concession and started feeling like the path of least resistance.

The standards story made the drift worse. Firefox arrives late to modern web platform features, and the gap on the consequential ones has grown from months to over a year. The [`:has()` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has), the most significant CSS addition in years, shipped in Chrome 105 in August 2022 and did not reach a Firefox release until version 121 in December 2023.[^3] [CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) followed the same pattern. The [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) arrived in Chrome in early 2023 and is still behind a flag in Firefox at the start of 2026. The [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning), and the [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) all line up the same way.

The practical consequence is that developers build for Chromium first. Firefox becomes the browser you test in, not the one you design around. I dislike that outcome, and I cannot pretend it is irrational when the implementation gap keeps showing up in real projects with real deadlines.

## Firefox

Firefox was the browser that taught me the web was worth caring about. I ran it on the family [Windows 98](https://en.wikipedia.org/wiki/Windows_98) machine when [Internet Explorer](https://en.wikipedia.org/wiki/Internet_Explorer) was slow, ugly, and riddled with toolbars nobody had asked for. Firefox had tabs. It had extensions. It felt like the browser was on my side.

[Firebug](https://en.wikipedia.org/wiki/Firebug_(software)), the Firefox extension built by [Joe Hewitt](https://en.wikipedia.org/wiki/Joe_Hewitt_(programmer)), more or less invented browser developer tools. Before Firebug, web debugging meant staring at source code until something gave. Firebug gave you a live DOM inspector, real-time CSS editing, a JavaScript console, and a network panel. Every set of DevTools shipping in a modern browser is a descendant of what Firebug started on Firefox. That is not a small inheritance, and it is most of the reason I have been forgiving for as long as I have.

But at some point the rough edges stopped feeling like the price of independence and started feeling like a habit.

### The AI debacle

In 2024, Mozilla began folding AI features into Firefox. Firefox 130 shipped with an [AI chatbot sidebar](https://blog.mozilla.org/en/mozilla/ai-services-on-firefox/) that sends page content to ChatGPT, Google Gemini, or other external providers. Mozilla announced [Mozilla.ai](https://blog.mozilla.org/en/mozilla/introducing-mozilla-ai-investing-in-trustworthy-ai/), a separate company building "trustworthy AI" products. They revised their privacy policy in ways that raised real questions about user data handling. They expanded AI-generated "recommended stories" on the new tab page through their [Pocket](https://en.wikipedia.org/wiki/Pocket_(service)) integration.[^4]

The community response was sharply negative, and for once that response felt earned rather than reflexive. Mozilla's identity is built on privacy, user agency, and an open web. Chasing the same AI trend every other tech company was already chasing did not read as vision. It read as misallocation. Forum threads filled with users asking why chatbot integration was being prioritised over CSS support, performance, or mobile stability.

Firefox 148 is now scheduled to include an "AI kill switch" following continued pushback from users who want the option to disable all AI features permanently.[^5] The fact that those features shipped without an off switch in the first place is the part that lingers. By itself, none of this would have moved me. In aggregate, it made Firefox feel less like the principled holdout I wanted it to be and more like a smaller company doing the same thing every larger company was doing.

### The Android app

Firefox on Android is genuinely difficult to recommend. Pages stall mid-load without an error message. Tabs freeze and refuse input. The app occasionally enters a state where it does not crash, it just stops responding entirely. Force-closing and reopening is the only recovery path.

The [GeckoView](https://wiki.mozilla.org/Mobile/GeckoView) architecture was supposed to be the foundation of a better mobile Firefox. The design is sound. The execution has not matched the promise, and it has been years since the rewrite shipped. A browser that cannot reliably load pages on the world's most common computing platform is not a viable alternative to anything. Once Firefox stopped being dependable on my phone, the work-versus-private split I had been protecting collapsed. There was no private browser left to protect.

## Why any of this matters

Here is the part that matters beyond personal convenience. Chrome, Edge, Opera, Brave, Vivaldi, and Arc all run on [Blink](https://en.wikipedia.org/wiki/Blink_(browser_engine)), Google's fork of [WebKit](https://en.wikipedia.org/wiki/WebKit). Safari runs on WebKit itself, which is closely related. That leaves Gecko as the only independent rendering engine with meaningful presence on the open web.[^6]

If Google decides to push a web feature that benefits its advertising business, the only browser engineering organisation that can refuse to implement it is Mozilla. A weakened Firefox means a web where Google's rendering decisions face no counterpressure worth mentioning. That is not an open web. That is a [monoculture](https://en.wikipedia.org/wiki/Monoculture) with open-source branding.

Mozilla's funding structure makes the picture more uncomfortable. Roughly 80% of Mozilla Corporation's revenue comes from a search deal with Google.[^7] The company whose dominance is the primary threat to rendering engine diversity also funds the only alternative. That does not mean Mozilla is compromised. It does mean the structural incentives are awkward, and that awkwardness shows up in prioritisation decisions whether anyone wants to talk about it or not.

This is the part that still bothers me. Leaving Firefox is not just a tooling change. It is a small individual contribution to the consolidation I dislike.

## Vivaldi, with my eyes open

I moved to [Vivaldi](https://en.wikipedia.org/wiki/Vivaldi_(web_browser)). It is Chromium-based, so it renders the modern web correctly and supports the Chrome extension ecosystem out of the box. The difference is everything Vivaldi has built on top of that engine, and the people who built it.

Vivaldi was founded in 2016 by [Jon Stephenson von Tetzchner](https://en.wikipedia.org/wiki/Jon_Stephenson_von_Tetzchner), the co-founder and former CEO of Opera Software. The premise is straightforward: a browser for people who care about how their browser works. What the marketing copy reads as a feature list turns out to be, in practice, a real set of shipped tools that earn their keep over a working week:

- **Tab stacking and tab tiling** for organising and comparing pages without extensions.
- **Web panels** that dock any site into a sidebar so reference material sits next to the thing you are doing.
- **A built-in mail client, feed reader, and calendar**, which sounds gratuitous and turns out to be useful.
- **Customisable keyboard shortcuts, a command palette, and mouse gestures** that cover every interaction pattern a long-time browser user has built muscle memory for.
- **Configurable toolbars, a notes panel, and page actions** for workflow shaping without poking at config files.
- **Native custom CSS theming**, which is exactly the small piece of agency I missed the most.

The company itself is based in Oslo, employee-owned, and funded through search partnerships. They do not track users. They do not sell browsing data. They have not shipped an AI gimmick or a crypto wallet. The business model is transparent and aligns with the stated mission of building a browser that respects the people using it.[^8]

## What it feels like in practice

The immediate relief is that the modern web works without negotiation. Pages render the way clients, dashboards, and SaaS products were built to render. Extensions behave. DevTools feel familiar. I no longer maintain a mental list of sites where I should probably switch browsers before doing anything important.

The pleasant surprise is the shell. Vivaldi feels built for people who keep a browser open all day and want it to behave like a workspace rather than a content slot. Tab stacks, web panels, keyboard shortcuts, and toolbar customisation are not revolutionary in isolation. Stacked together, they make the browser feel less hostile to power use than Chrome and less neglected than Firefox.

## The last caveat

The trade still bothers me. I am giving up Gecko for a browser that respects user agency but still renders through Google's engine. I accept the trade because Firefox is no longer competitive enough on standards, mobile, or strategic direction for me to keep pretending the choice is only ideological. Vivaldi at least delivers a product that treats its users as competent adults.

Mozilla still does important work. The [Mozilla Foundation](https://en.wikipedia.org/wiki/Mozilla_Foundation) funds internet health research, privacy advocacy, and open standards. [MDN Web Docs](https://developer.mozilla.org/) is the definitive reference for web technologies, and that alone justifies a lot. Gecko continuing to exist at all is a net positive for the web.

But a browser needs to be usable, ship standards on time, and align its priorities with the people relying on it. Firefox currently struggles on all three. I held on for years. I filed bugs. I donated. I ran Nightly builds. I told myself, every release, that the next one would make the old argument easy again. At some point loyalty turns into pretending, and pretending is its own kind of cost.

So it is Vivaldi for now. I will keep an eye on Gecko. Some part of me is still rooting for it to find a second wind.

[^1]: Backlinko. (2025). [Browser Market Share Statistics](https://backlinko.com/browser-market-share). Google Chrome held 70.5% of the global browser market as of September 2025.

[^2]: PCWorld. (2012). [Google Chrome overtakes Internet Explorer](https://www.pcworld.com/article/464648/google_chrome_overtakes_internet_explorer.html). StatCounter reported Chrome passing Internet Explorer worldwide in May 2012.

[^3]: MDN Web Docs. [`:has()` CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/:has). Shipped in Chrome 105 (August 2022) and Firefox 121 (December 2023).

[^4]: Hacker News. (2024). [Firefox update added more sponsored content on the new-tab page](https://news.ycombinator.com/item?id=41497051). Community discussion of Firefox 130's new-tab changes including AI sidebar and sponsored content.

[^5]: TechPowerUp. (2026). [Firefox 148 gets AI killswitch after community backlash](https://www.techpowerup.com/345932/firefox-148-gets-ai-killswitch-after-a-massive-community-backlash). Firefox 148 adds an option to disable all AI-powered features.

[^6]: StatCounter. (2025). [Desktop browser market share worldwide](https://gs.statcounter.com/browser-market-share). Gecko/Firefox represents approximately 3% of global desktop browser usage.

[^7]: Wikipedia. [Mozilla Corporation](https://en.wikipedia.org/wiki/Mozilla_Corporation). Historically, approximately 80% of revenue derives from the Google search deal.

[^8]: Vivaldi. (2016). [Vivaldi browser launch](https://vivaldi.com/blog/vivaldi-finale-1-0/). Founder statement on building a browser for power users, funded through search partnerships without user tracking.
