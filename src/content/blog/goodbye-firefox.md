---
title: "Goodbye Firefox"
pubDate: 2026-01-17
excerpt: "After years of holding on, I finally dropped Firefox."
tags: [Switching To, Digital Freedom, Consumer Rights]
heroImage: "/blog/dotBlog_Goodbyefirefox.png"
draft: false
---

The first time I used [Firefox](https://en.wikipedia.org/wiki/Firefox) was on my family's [Windows 98](https://en.wikipedia.org/wiki/Windows_98) machine. I don't remember how I found it. Probably a recommendation from a forum or a friend at school. But I remember what it felt like.

[Internet Explorer](https://en.wikipedia.org/wiki/Internet_Explorer) was all I knew at that point, and it was miserable. Slow, ugly, riddled with toolbars nobody asked for, and seemingly allergic to rendering anything correctly. Firefox was a revelation. It was fast. It had tabs. It felt like the browser *wanted* you to use the web, not fight with it. I was hooked immediately.

## Firebug and the love affair

What really cemented it, though, was [Firebug](https://en.wikipedia.org/wiki/Firebug_(software)).

If you weren't around for it, [Firebug](https://getfirebug.com/) was a Firefox extension created by [Joe Hewitt](https://en.wikipedia.org/wiki/Joe_Hewitt_(programmer)) that essentially invented browser developer tools as we know them. Before Firebug there was nothing. You wrote HTML and CSS and if something looked wrong you stared at the source until your eyes bled. Firebug gave you a live DOM inspector, a CSS editor that updated in real time, a JavaScript console, a network tab, the works. It was magic.

I can trace a direct line from Firebug to me falling in love with web development. Being able to *see* what was happening, to poke at the DOM and watch things change, that's what made the web feel like a playground instead of a black box. Every browser's DevTools today, from Chrome to Safari, is a descendant of what Firebug started. It was that important.

## The Chrome shift

Then [Google Chrome](https://en.wikipedia.org/wiki/Google_Chrome) showed up in September 2008 and everything changed.

Chrome was fast. Not incrementally fast, not "a bit snappier" fast. It was a different league. The [V8 JavaScript engine](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)) was built from the ground up for speed, with [just-in-time compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation) that made JavaScript execution feel instant compared to what Firefox's [SpiderMonkey](https://en.wikipedia.org/wiki/SpiderMonkey) was doing at the time. Each tab ran in its own process, so one bad page didn't take down the whole browser. The UI was minimal to the point of being almost invisible, all screen real estate given to the web itself.

And it wasn't just speed. Chrome's developer tools were excellent from the start, clearly inspired by Firebug but integrated natively and iterated on aggressively. The extension model was cleaner. Updates were silent and automatic. Everything about it felt like a product built by people who understood what both users and developers actually wanted from a browser.

Firefox responded, but slowly. Their multi-process architecture, [Electrolysis](https://wiki.mozilla.org/Electrolysis), took years to ship and arrived long after Chrome had made process-per-tab the baseline expectation. The [Quantum](https://en.wikipedia.org/wiki/Quantum_(Mozilla)) rewrite in 2017 was genuinely impressive, a massive overhaul of the rendering engine with components written in [Rust](https://en.wikipedia.org/wiki/Rust_(programming_language)), and it made Firefox feel competitive again for a while. But the pattern was always the same: Chrome shipped something, Firefox caught up a year or two later, and by then Chrome had already moved on to the next thing.

## The last independent engine

Here's the thing that still matters, though. Firefox runs on [Gecko](https://en.wikipedia.org/wiki/Gecko_(software)), and it is now the only relevant browser engine that isn't [Chromium](https://en.wikipedia.org/wiki/Chromium_(web_browser)).

Think about that for a second. Chrome, [Edge](https://en.wikipedia.org/wiki/Microsoft_Edge), [Opera](https://en.wikipedia.org/wiki/Opera_(web_browser)), [Brave](https://en.wikipedia.org/wiki/Brave_(web_browser)), [Vivaldi](https://en.wikipedia.org/wiki/Vivaldi_(web_browser)), [Arc](https://en.wikipedia.org/wiki/Arc_(web_browser)), Samsung Internet, all of them run on [Blink](<https://en.wikipedia.org/wiki/Blink_(browser_engine)>), which is Google's fork of [WebKit](https://en.wikipedia.org/wiki/WebKit). [Safari](https://en.wikipedia.org/wiki/Safari_(web_browser)) runs on WebKit itself, which shares deep roots with Blink. That leaves Gecko. Alone.

Google controls Blink. Google controls V8. Google effectively sets the pace for what the web can do and how it does it. The [Chromium project](https://www.chromium.org/Home/) is open source, yes, and that provides some protection, but "open source" doesn't mean "open governance." Google's engineers drive the roadmap. Google's priorities shape the features. If Google ever decides, whether through financial pressure or strategic interest, to push the web in a direction that serves its ad business at the expense of openness, there's barely anyone left to offer an alternative rendering of the same page. That's not a healthy ecosystem. That's a [monoculture](https://en.wikipedia.org/wiki/Monoculture).

## So why am I leaving

Because Firefox has been making it really hard to stay.

**Standards keep arriving late.** The [`:has()` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has), arguably the most significant CSS addition in years, shipped in Chrome 105 in August 2022 and didn't land in Firefox until December 2023, over a year later. [CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) shipped in Chrome 105 alongside `:has()` but Firefox didn't get them until Firefox 110 in February 2023, months behind. The [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)? Chrome shipped it in early 2023. Firefox still has it behind a flag heading into 2026. The [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), the [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API), [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning), all of them arrive in Firefox late or not at all. If you're building for the modern web, you are building for Chromium first and hoping Firefox catches up eventually. That's a terrible position for a browser that claims to champion the open web.

**The AI debacle.** In mid-2024, Mozilla started bolting AI features onto Firefox. First came the [AI chatbot sidebar](https://blog.mozilla.org/en/mozilla/ai-services-on-firefox/) in Firefox 130, letting users pipe page content to ChatGPT, Google Gemini, or other providers directly from the browser. Then they announced [Mozilla.ai](https://blog.mozilla.org/en/mozilla/introducing-mozilla-ai-investing-in-trustworthy-ai/), a startup spun up to build "trustworthy AI." They revised their privacy policy in ways that made people nervous about data usage, though they later walked back some of the language. And they rolled out an AI-generated "recommended stories" feature on the new tab page through their [Pocket](https://en.wikipedia.org/wiki/Pocket_(service)) integration.

The community response was immediate and harsh. This is Mozilla. The organization whose entire identity is built on privacy, user agency, and an open web. And they were chasing the same AI trend that every tech company was stumbling over itself to ship, not because users were asking for it, but because the industry decided it was the next gold rush. The forums filled with people asking why engineering resources were going toward chatbot sidebars instead of fixing the actual browser. It felt like a betrayal of priorities, and it was.

**Android is broken.** I don't know how else to put this. [Firefox on Android](https://en.wikipedia.org/wiki/Firefox_for_Android) is genuinely painful to use. Pages stall mid-load for no discernible reason. Tabs freeze and refuse to respond to input. Sometimes the entire app just... stops. Not a crash. It doesn't close. It just stops doing anything, sitting there with a blank stare until you force-close it and reopen it. I've lost count of how many times I've had to kill the app just to get it to *ping* again. The [GeckoView](https://wiki.mozilla.org/Mobile/GeckoView) rewrite was supposed to be the foundation of a better mobile Firefox, and on paper it was a solid architectural move, but in practice the experience is rough. It's been years and it still feels like a beta.

Any one of these I could live with. All three together? I'm done waiting.

## Vivaldi

So I'm moving to [Vivaldi](https://en.wikipedia.org/wiki/Vivaldi_(web_browser)).

Vivaldi was founded in 2016 by [Jon von Tetzchner](https://en.wikipedia.org/wiki/Jon_Stephenson_von_Tetzchner), the same guy who co-founded Opera back when Opera was actually good. The premise is simple: build a browser for people who care about how their browser works. It's Chromium under the hood, so you get full compatibility with the modern web and the Chrome extension ecosystem. But the shell around that engine is where it diverges completely.

Tab stacking. Tab tiling. A built-in mail client, a feed reader, a calendar. Customizable keyboard shortcuts for everything. Command palette. Configurable toolbars. A notes panel. Web panels that let you dock any site into a sidebar. Mouse gestures. Page actions. Custom CSS theming. It's the power-user browser that Firefox used to feel like back in the extension golden age, except the features are native and they actually work.

The company is based in [Oslo](https://en.wikipedia.org/wiki/Oslo), self-funded through search partnerships, and they've been vocal about not tracking users, not selling data, and not chasing trends. No AI gimmicks. No crypto wallets. Just a browser that respects the people using it.

## What I'm not saying

I don't hate Mozilla. I don't hate what Firefox represents. The [Mozilla Foundation](https://en.wikipedia.org/wiki/Mozilla_Foundation) still funds important work in internet health, privacy advocacy, and open standards. [MDN Web Docs](https://developer.mozilla.org/) is one of the best resources on the internet and I use it often. Gecko existing at all is a net positive for the web.

But Mozilla's funding reality casts a long shadow. Roughly [80% of Mozilla Corporation's revenue](https://en.wikipedia.org/wiki/Mozilla_Corporation) comes from a search deal with Google. That's the same Google whose browser dominance is the primary threat to the open web. It's a dependency that makes Mozilla's independence feel more symbolic than structural. If that deal shrinks, or ends, what's left? And in the meantime, the browser itself is falling behind in ways that matter to the people who actually build the web.

I've held on for years. I evangelized Firefox to friends, family, and colleagues. I filed bugs. I donated. I ran Nightly builds. But faith needs something to hold onto, and right now Firefox isn't giving me enough.

So it's Vivaldi for a while. Maybe a long while. And I'll keep one eye on Gecko, hoping it finds a second wind.

Who knows what the future holds.
