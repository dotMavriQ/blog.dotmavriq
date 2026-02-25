---
title: "128 by 128"
pubDate: 2026-02-25
excerpt: "Rain, loss, AI fatigue, and why I made a zombie game in a language nobody asked me to learn."
tags: [Slice of Life, Developer, Lua]
heroImage: "/blog/dotBlog_Zombial.png"
draft: false
---

It's been raining. Not the kind that comes and goes. The kind that moves in and doesn't leave. From mid-January through mid-February the Lisbon coast barely caught a break. Three straight weeks of drizzle, fog, scattered showers, proper rain. [Alcabideche](https://en.wikipedia.org/wiki/Alcabideche), where I live, got it bad. The [Leiria](https://en.wikipedia.org/wiki/Leiria) region further north got it worse, nearly 80mm across the month. The kind of weather where you don't go outside unless you have to, and even then you question it.

I've been spending a lot of time indoors.

## Weight

Some of it is the weather. Some of it isn't.

We recently lost someone in the family. I'm not going to go into details because it's not mine alone to share. But it sits with you. You carry it and it gets into everything, even the stuff that has nothing to do with it.

And then there's work. Or rather, the looking for it. I've never looked better on paper. My skills are sharper than they've been, my portfolio is broader, I have references who'd vouch for me without hesitation, and I genuinely feel more capable than at any prior point in my career. The job market doesn't care about your personal bests though. It cares about timing, geography, and luck.

## The geography problem

I live in Portugal. I love it here. But when you're looking for contract work or new opportunities as a developer, the scope narrows fast once you filter for remote-friendly positions or hybrid setups with a sane commute. I'm not going to spend ten-plus hours of my day on a routine where only eight of them generate income. Not if I can help it. I'd love some IRL colleagues, genuinely, but I'm not willing to burn two to three hours every work day in transit to get them. That math doesn't work out.

So you look, and the options aren't as many as you'd like.

## AI changed the game

I was on this early. Before [GPT-3.5](https://en.wikipedia.org/wiki/GPT-3) even made it useful for serious work, I was poking at it. When ChatGPT first got good enough to be useful, the first thing I did was use it to iron out some rough nested functions in PHP. Limited scope, but it worked. You could feel where it was going.

And it went there fast. [Claude 3.5 Sonnet](https://en.wikipedia.org/wiki/Claude_(language_model)) dropped in mid-2024 and suddenly the coding assistance was genuinely competent. [Gemini 2.5 Pro](https://en.wikipedia.org/wiki/Gemini_(language_model)) followed. Then [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-3-5-sonnet) in September 2025, and just recently [Claude Opus 4.5](https://en.wikipedia.org/wiki/Claude_(language_model)) in February 2026. Each generation noticeably better than the last. The LinkedIn grifters will tell you with exaggerated vigor that these tools "replace lesser developers." What they actually do, if you're being honest about it, is this: you put them in the hands of developers who already know what they're doing, apply enough mindful approaches, and you win marginal productivity gains. [METR](https://metr.org/) ran a [randomized controlled trial](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) on experienced open-source developers and found that AI tools made them **19% slower**, not faster. The kicker? The developers themselves estimated they were 20% faster. The gap between perception and reality is wild.

Most companies now expect you to use AI tooling as part of your workflow regardless. [GitHub Copilot](https://en.wikipedia.org/wiki/GitHub_Copilot) in your editor. ChatGPT or Claude for drafting, debugging, researching. [Cursor](https://www.cursor.com/) for pair-programming with a model. It's table stakes now. Job listings mention it. Interviewers ask about it.

I use these tools. I'm not a [luddite](https://en.wikipedia.org/wiki/Luddite). They help. But by the very nature of it, you try to the best of your ability to delegate work, often forgetting the methodology that renders quality code in the process, all in the interest of time. It drains your creativity. When the first instinct for every problem becomes "ask the model," you start to feel a distance from the craft. There's this small but constant fear that your reliance on AI is quietly making you dumber. That the muscles you built over years of banging your head against problems are atrophying because you outsourced the headbanging.

I needed something to counteract that.

## Picking a language

I decided I was going to learn a language. Not for work. Not for my CV. Not because a recruiter asked. Just for myself. For the love of writing code.

I made one rule: every single line of code I produce in this language gets typed and formatted by hand. By me. I'm allowed Copilot autocomplete. I'm allowed to ask any model questions. But the code itself? That's mine. Every character, every indent, just like I used to do it before any of this existed.

I considered [Go](https://en.wikipedia.org/wiki/Go_(programming_language)). I've written some smaller Go scripts over the years and I like the philosophy. I even flirted with [Ada](https://en.wikipedia.org/wiki/Ada_(programming_language)) for a minute, the darling of military-grade software, because there's something appealing about a language designed to not let you screw up. But I kept coming back to one name.

[Lua](https://en.wikipedia.org/wiki/Lua_(programming_language)).

## Why Lua

Lua was created in 1993 at [PUC-Rio](https://en.wikipedia.org/wiki/Pontifical_Catholic_University_of_Rio_de_Janeiro) in Brazil by Roberto Ierusalimschy, Waldemar Celes, and Luiz Henrique de Figueiredo. Brazil had strict trade barriers on computer hardware and software at the time, so the researchers needed a flexible scripting language they could build in-house. What came out of that constraint is a language that's absurdly small, absurdly fast, and absurdly embeddable. The entire interpreter compiles into something like 200KB.

It can kind of do whatever you'd reach for [Python](https://en.wikipedia.org/wiki/Python_(programming_language)) to do, but at a fraction of the footprint. And it's everywhere if you know where to look. [Neovim](https://en.wikipedia.org/wiki/Neovim) uses it as its primary plugin language. [AwesomeWM](https://en.wikipedia.org/wiki/Awesome_(window_manager)) is configured entirely in it. [Nginx](https://en.wikipedia.org/wiki/Nginx) via [OpenResty](https://en.wikipedia.org/wiki/OpenResty) uses it for high-performance web scripting. In gaming the list is long: [World of Warcraft](https://en.wikipedia.org/wiki/World_of_Warcraft) addons, [Civilization](https://en.wikipedia.org/wiki/Civilization_(series)) modding, [Roblox](https://en.wikipedia.org/wiki/Roblox), [Garry's Mod](https://en.wikipedia.org/wiki/Garry%27s_Mod), [LÖVE2D](https://en.wikipedia.org/wiki/L%C3%96VE_(game_framework)).

Now, Lua has its quirks. Arrays are 1-indexed, which trips up anyone coming from C-family languages. There's no `continue` statement, which feels like a missing stair you keep almost falling down. The standard library is intentionally minimal so you build or import a lot yourself. And [metatables](https://www.lua.org/pil/13.html), Lua's mechanism for object-oriented patterns, are powerful but take a minute to click. The community joke is that Lua's idea of OOP is "here's a table, good luck."

That's also what makes it fun though. It trusts you.

I started small. Replaced a few of my bash and Python scripts with Lua equivalents just to see if I could. Then the rabbit hole opened. I got into [LÖVE2D](https://en.wikipedia.org/wiki/L%C3%96VE_(game_framework)), which resulted in an odd project where I wrote [BUFLO](/portfolio/?tags=Lua), an invoice generator, as a desktop app in a game framework. Because why not. I also wrote the original [Linea](/portfolio/?tags=Lua), which is essentially a TUI that links two APIs together, [Linear](https://en.wikipedia.org/wiki/Linear_(company))'s [GraphQL](https://en.wikipedia.org/wiki/GraphQL) API and [Gemini](https://en.wikipedia.org/wiki/Gemini_(language_model)), to have an AI assistant when resolving issues from the terminal. Claude is better at it, but Gemini is cheaper, so.

## PICO-8

So I had the language. Now I needed something to do with it.

[PICO-8](https://www.lexaloffle.com/pico-8.php) is a fantasy console by Joseph White of [Lexaloffle](https://www.lexaloffle.com/). It's not real hardware. It's an emulator for a machine that never existed. The constraints are deliberate: 128×128 pixel display, fixed 16-color palette, 4-channel audio, 8192-token limit for your code. You write everything in Lua.

Now, you *can* cheese it. There's `#include` for pulling in external files. People have used Python to procedurally generate chunks of Lua. You can work around the token limit, work outside the built-in editor, do all kinds of clever stuff to sidestep the walls. But that's missing the point. The whole charm of PICO-8 is that it structurally forces you to sit in this fictional [C64](https://en.wikipedia.org/wiki/Commodore_64)-like environment with its fugly little font, its tiny sprite editor, its map editor, its tracker for audio. Everything in one box. You want to make a really cool game? Learn the rules so you can break them. Get good at understanding PICO-8. Get even better at Lua.

And PICO-8 has a thriving community on its [BBS](https://www.lexaloffle.com/bbs/?cat=7) where people share "carts," tiny self-contained games and demos. You can play them in the browser, read the source, and learn from how others solve problems within the same box. It's open, generous, and refreshingly quiet compared to most developer spaces.

That's exactly what I was looking for.

## Zombial

My weekend project was to make a game from scratch. No tutorial. No template. Just me, the PICO-8 editor, and the Lua reference manual.

[Zombial](https://dotmavriq.itch.io/zombial) is a top-down action game set on [Zavial beach](https://en.wikipedia.org/wiki/Praia_do_Zavial) in Portugal. Yes, [that Zavial](/blog/zavial/). You play as Nuno, who wakes up on the cursed shoreline with a baseball bat. Zombies come in waves. Some of them are tougher Spitter types. You scavenge sodas to restore health. You swing. You survive. The soundtrack leans on [Portuguese fado](https://en.wikipedia.org/wiki/Fado) during gameplay and channels [Bohren und der Club of Gore](https://en.wikipedia.org/wiki/Bohren_%26_der_Club_of_Gore) for the menu.

Simple by design. That's the point.

## Getting stuck

The part that really had me stuck was damage feedback. When your character takes a hit in a game, there needs to be an immediate reaction. Without it, getting hurt feels like nothing happened. The player doesn't flinch, so the player doesn't care.

I tried a bunch of things. Screen shake on its own wasn't enough. A flat color flash felt cheap. I needed something that said "you just got hurt" clearly, on a 128×128 screen, in a way that felt good.

Then I found [BRAM: Blood Moon](https://bram-bloodmoon.itch.io/). It's a PICO-8 action game that nails this. Brief screen shake, palette-swap flash on the sprite, short invincibility window with a blink. Intuitive, readable, works within the constraints. I studied how it was done and implemented something similar for Zombial: a quick camera jolt, a white flash, and a brief period where Nuno blinks. Took the combat from feeling numb to feeling right.

That moment where you go from stuck to solving it by studying someone else's work? That's the feeling I was after. No AI wrote that for me. I found it by playing a game, reading code, and thinking about it until it clicked.

## Why it matters

I set out to finish my draft about the zombie game I made this weekend. Not to write a post about hardship. But sitting here now, it's hard to separate the two.

You're dealing with loss. The weather won't let up. The job market is what it is. AI is changing how you work whether you asked for it or not. And somewhere in the middle of all that you sit down and you write a zombie game in a language nobody asked you to learn, just because you wanted to. Just because it's fun. Just because it makes you feel like a programmer again instead of someone who prompts for a living.

And in a way I'm back where I started. I spent weeks as a kid trying to make games in early versions of [Mark Overmars' Game Maker](https://en.wikipedia.org/wiki/GameMaker). No idea what I was doing. Didn't matter. The point was that I was making something and it was mine.

I think that's worth protecting. The impulse to make something just because you can. To stay curious and stay hungry even when the practical incentives aren't there. It sharpens you in ways that no AI tool will. And honestly, it's how I've gotten through every hard stretch I can remember. Not by optimizing. By doing something pointless that I care about.

The rain will stop. It always does. In the meantime, [keep swinging](https://www.lexaloffle.com/bbs/?pid=184408#p).
