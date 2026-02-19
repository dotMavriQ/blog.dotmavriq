---
title: "Friends with PHP Again"
pubDate: 2024-02-01
excerpt: "I never thought I'd say this, but PHP and I are on good terms again."
tags: [PHP, Developer, Laravel]
heroImage: "/blog/dotBlog_FriendsWithPHPagain.png"
draft: false
---

I never thought I'd say this, but [PHP](https://en.wikipedia.org/wiki/PHP) is genuinely good now.

## What happened to the JavaScript crowd

Let's talk about what's going on in JS land. Because it's a mess.

[React](https://en.wikipedia.org/wiki/React_(JavaScript_library)) introduced Server Components and nobody could agree on what they were for. [Next.js](https://en.wikipedia.org/wiki/Next.js) went all in on the App Router and broke half the tutorials on the internet. People were fighting about whether to use Pages Router or App Router, `getServerSideProps` or server actions, client components or server components. The docs were rewritten while people were still learning the old way.

Meanwhile the rest of the ecosystem kept splintering. [Svelte](https://en.wikipedia.org/wiki/Svelte) rewrote everything with Runes. [Solid](https://www.solidjs.com/) exists and is fast but nobody uses it. [Astro](https://en.wikipedia.org/wiki/Astro_(web_framework)) carved out a niche for content sites. [Remix](https://remix.run/) merged with React Router somehow. Every six months there's a new meta-framework that does what the last one did but with different tradeoffs and a fresh set of breaking changes.

The term "framework fatigue" has been around for years but it really peaked somewhere around here[^1].

[^1]: If you haven't read ["XML is the future"](https://www.bitecode.dev/p/hype-cycles) by Bite Code, do yourself a favor. It traces how tech keeps repeating the same hype cycles, from XML to NoSQL to microservices to SPAs, and how devs keep falling for it because we think we're too rational to be swayed by marketing. Spoiler: we're not. I watched senior devs with a decade of experience struggle to set up a basic Next.js project because the conventions changed under them. That's not normal.

## PHP didn't stand still

While the JS world was busy reinventing itself, PHP quietly got its act together.

[PHP 8.3](https://www.php.net/releases/8.3/en.php) dropped in November 2023 and it's genuinely modern. We're talking typed class constants, the `json_validate()` function, `#[Override]` attributes. Go back a few versions and you hit [enums](https://www.php.net/manual/en/language.enumerations.php), [fibers](https://www.php.net/manual/en/language.fibers.php), readonly classes, named arguments, match expressions, union and intersection types. If you stopped paying attention at PHP 5, you'd barely recognize the language.

The runtime is fast too. PHP 8 with JIT compilation is seriously competitive. Not "fast for PHP" but actually fast. The kind of fast where you stop making excuses.

## Laravel changed everything

But PHP alone wouldn't have pulled me back. [Laravel](https://en.wikipedia.org/wiki/Laravel) did that.

[Laravel 10](https://laravel.com/docs/10.x) was already solid, but the ecosystem around it is what really stands out. [Taylor Otwell](https://en.wikipedia.org/wiki/Taylor_Otwell) and the team have been on an absolute tear:

- **[Livewire 3](https://livewire.laravel.com/)** dropped and it's a game changer. Full reactive UI components written in PHP. No JavaScript, no build step, no npm. You write a PHP class and a Blade template and you get interactive components that feel like a SPA. For 90% of what people build, you don't need React anymore.
- **[Volt](https://livewire.laravel.com/docs/volt)** takes Livewire further with single-file components. Think Vue's `.vue` files but in PHP. Your logic and template live in the same file.
- **[Folio](https://laravel.com/docs/11.x/folio)** brings file-based routing to Laravel. Drop a Blade file in the right folder and it's a route. Just like Next.js but without the twelve layers of abstraction.
- **[Laravel Herd](https://herd.laravel.com/)** is a native dev environment for Mac and Windows. One-click PHP setup, no Docker, no Homebrew, no config files. It just works.
- **[Pint](https://laravel.com/docs/11.x/pint)** handles code formatting. Think Prettier but for PHP, opinionated and zero-config.

And [Laravel 11](https://laravel.com/docs/11.x) is right around the corner with a slimmed-down skeleton, per-second cron scheduling, and health check routing built in.

## The DX is actually great now

What really surprised me is how good the developer experience got. The days of clunky `artisan` commands and cryptic error pages are over. Laravel now ships with:

- **[Laravel Breeze](https://laravel.com/docs/11.x/starter-kits#laravel-breeze)** and **[Jetstream](https://jetstream.laravel.com/)** for auth scaffolding that actually looks good
- **[Telescope](https://laravel.com/docs/11.x/telescope)** for debugging requests, queries, jobs, mail, everything
- **[Horizon](https://laravel.com/docs/11.x/horizon)** for queue monitoring with a beautiful dashboard
- **Real error pages** via [Ignition](https://github.com/spatie/laravel-ignition) that show you exactly what went wrong, with suggested fixes

The tooling around it is mature. [Spatie](https://spatie.be/open-source) alone has published hundreds of packages that cover everything from media handling to permissions to backup. The ecosystem is deep in a way that JS frameworks just aren't.

## Why this matters

I'm not here to start a language war. I still write JavaScript. I still like TypeScript. I built this blog with Astro.

But there's something to be said for a stack where you can build a full app with auth, database, queues, email, API, admin panel, and deploy it on a $5 server without touching a single line of JavaScript. No webpack. No node_modules. No hydration. No "use client". Just PHP, a database, and you're done.

PHP isn't a joke anymore. It might actually be the most practical language for building web apps right now. And I say that as someone who spent years making fun of it.

## My latest PHP project

To put my money where my mouth is, I recently built a WordPress plugin called [TeamTailor Integrator](https://github.com/dotMavriQ/TeamTailor-Integrator-For-WordPress). It syncs job listings from [TeamTailor](https://www.teamtailor.com/) into WordPress as custom post types, maps their departments and locations to taxonomies, and keeps everything in sync with a cron job. SEO-friendly markup out of the box.

Nothing fancy. Just a well-structured plugin that talks to an API, stores data properly, and does its job without breaking. That's the kind of thing PHP is really good at, and the kind of thing that would have taken me twice as long with a JS stack and a database adapter and a build step and a deployment pipeline and... you get the idea.
