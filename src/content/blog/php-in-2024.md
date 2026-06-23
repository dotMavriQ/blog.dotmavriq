---
title: "PHP in 2024"
pubDate: 2024-02-01
excerpt: "PHP grew up quietly while the JavaScript ecosystem kept tearing itself apart. The language and its tooling are genuinely good now, and Laravel is the proof."
heroImage: "/img/blog/php-in-2024.webp"
tags: [PHP, Laravel]
draft: false
---

PHP has a reputation problem that no longer matches the language. The jokes are mostly from the PHP 5 era. The language moved on a long time ago. A lot of the people still making those jokes never bothered to check.

I have been writing PHP for years, through the rough parts and into the current era. I still understand why people flinch at the name. I also think modern PHP, and Laravel in particular, is one of the most productive web stacks available right now. The interesting part is how unfashionably it got there: by being patient.

## The instability tax on the other side of the fence

PHP's quiet resurgence is partly its own merit and partly a side-effect of what happened to the JavaScript ecosystem in the same window.

[React](https://en.wikipedia.org/wiki/React_(JavaScript_library)) introduced Server Components and the community immediately fractured over what they were for. [Next.js](https://en.wikipedia.org/wiki/Next.js) shipped the App Router and invalidated a large portion of existing tutorials, courses, and patterns.[^1] The migration path from Pages Router to App Router was not incremental. It was a rewrite.

[Svelte](https://en.wikipedia.org/wiki/Svelte) previewed a complete rewrite of its reactivity model with Runes. [Remix](https://remix.run/) kept shipping at a pace that left most teams unsure which patterns from last year still applied. [Solid](https://www.solidjs.com/) posted benchmark numbers nobody could argue with but struggled to find adopters. [Astro](https://en.wikipedia.org/wiki/Draft:Astro_(web_framework)) carved out a strong niche for content sites. Every six months, a new meta-framework appears with different tradeoffs and a fresh set of breaking changes. Some of them are genuinely good. That is part of the problem. Good ideas still cost migration time, and migration time is not free.

This is not "framework fatigue" as a cultural gripe. It has measurable cost. Recurring hype cycles in software keep adopting, rewriting, and abandoning tooling on cycles short enough to invalidate professional expertise.[^2] When senior developers with a decade of experience need an afternoon to set up a basic project because the conventions shifted under them, that is not innovation by itself. It is an ecosystem stability failure dressed up as progress.

## What changed in PHP

PHP did not stand still during this period. It matured methodically, version by version, without anyone making a fuss about it.

[PHP 8.3](https://www.php.net/releases/8.3/en.php), released in November 2023, shipped with typed class constants, `json_validate()`, and `#[Override]` attributes.[^3] Earlier 8.x releases brought [enums](https://www.php.net/manual/en/language.enumerations.php), [fibers](https://www.php.net/manual/en/language.fibers.php), readonly classes, named arguments, match expressions, and union and intersection types. The type system has undergone a transformation that puts it closer to TypeScript's expressiveness than most developers realise. The language now warns me about the kinds of bugs I used to ship.

The runtime story is the other half. PHP 8's JIT compiler brought the language into competitive territory with runtimes that were previously in a different performance class entirely. Phoronix's PHP 8.0 benchmarks showed improvements of roughly 1.5x to 3x over PHP 7.4 on computation-heavy workloads.[^4] None of that lands in your typical request cycle, but it changes what is plausible to build in the language at all.

This was not a single dramatic release. It was a sustained modernisation effort across half a decade. Boring, in the best possible way. The language kept sanding down old pain points until the old caricature stopped matching the thing in front of us.

## Laravel as a full-stack platform

The language improvements created the foundation. [Laravel](https://en.wikipedia.org/wiki/Laravel) did the part PHP always needed: it made the modern language feel like a complete product surface rather than a collection of features.

[Taylor Otwell](https://en.wikipedia.org/wiki/Taylor_Otwell) and the Laravel team have been shipping at a pace that is unusual for a mature framework, and the recent additions are not polish. They show Laravel pushing into territory that JavaScript frameworks usually claim as their own.

[**Livewire 3**](https://livewire.laravel.com/) is the most consequential one. It gives you full reactive UI components written entirely in PHP. No JavaScript build step, no npm dependency chain, no client-side framework. A PHP class and a Blade template produce interactive components that behave like a single-page application. For the majority of web apps, particularly CRUD-heavy business tools, admin panels, and content platforms, this removes the need for a separate frontend framework.

[**Volt**](https://livewire.laravel.com/docs/volt) extends Livewire with single-file components, placing logic and template in the same file. The mental model is similar to Vue's `.vue` files, but execution stays on the server where it belongs.

[**Folio**](https://laravel.com/docs/11.x/folio) introduces file-based routing. A Blade file in the right directory becomes a route. Convention over configuration, the same idea Next.js popularised, without the build complexity.

[**Laravel Herd**](https://herd.laravel.com/) provides a native development environment for macOS. One-click PHP setup with no Docker, no Homebrew, no manual configuration. This is a direct answer to one of PHP's oldest criticisms, that local setup was unnecessarily painful, and the answer is "fine, here is a thing that just works."

## Developer experience as a competitive advantage

The tooling around Laravel has reached a depth that few ecosystems match.

[**Telescope**](https://laravel.com/docs/11.x/telescope) gives you request-level debugging: queries, jobs, mail, cache operations, everything observable from a single dashboard. [**Horizon**](https://laravel.com/docs/11.x/horizon) monitors queue workers with live metrics. [**Ignition**](https://github.com/spatie/laravel-ignition) by [Spatie](https://spatie.be/open-source) replaced PHP's historically poor error pages with contextual diagnostics that often include the suggested fix. [**Pint**](https://laravel.com/docs/11.x/pint) handles code formatting with zero configuration.

Spatie deserves particular mention. The team has published hundreds of open-source packages covering media handling, permissions, backups, data transfer objects, and most of the boring problems every web app eventually needs to solve.[^5] The quality is consistently high and the maintenance is active. This kind of ecosystem depth takes years to build. You cannot announce it into existence with a launch post.

Authentication scaffolding through [**Breeze**](https://laravel.com/docs/11.x/starter-kits#laravel-breeze) and [**Jetstream**](https://jetstream.laravel.com/) ships production-ready auth flows out of the box. Compare that to the JavaScript side, where authentication in a Next.js application typically means choosing between NextAuth, Clerk, Auth0, or Supabase Auth, each with different tradeoffs, different integration patterns, and different bills at the end of the month.

## The practical argument

The strongest case for modern PHP is not theoretical. It is practical. I can spin up a Laravel application with Livewire and ship a full product with authentication, database management, background jobs, email, API endpoints, and an admin panel. It deploys on a five-dollar VPS. The dependency tree is manageable. The build step is optional. The server requirements are minimal.

This is not a limitation. It is a design philosophy. PHP optimised for shipping complete applications with minimal infrastructure complexity, while much of the JavaScript ecosystem optimised for compositional flexibility at the cost of operational overhead.

Neither approach is categorically better. But for a large class of web applications, the ones where time-to-production matters more than client-side interactivity, the PHP stack delivers more with less friction. I reach for it more often than I expected to, which is probably the strongest endorsement I can give it.

## Where this shows up in practice

I recently built the [TeamTailor Integrator](https://github.com/dotMavriQ/TeamTailor-Integrator-For-WordPress), a WordPress plugin that syncs job listings from [TeamTailor's](https://www.teamtailor.com/) JSON:API into WordPress as custom post types, maps departments and locations to taxonomies, and keeps everything current via `wp_cron`. SEO-friendly markup out of the box.

It was a good test of where modern PHP actually improves the WordPress development experience. I used typed class properties and `json_validate()` from PHP 8.3 to check API responses before decoding. `match` expressions replaced the nested `if`/`else` chains that older WordPress plugins are full of. Named arguments made calls like `wp_insert_post` and `register_post_type` readable without memorising positional parameter order.

WordPress plugin development has historically meant working around PHP's limitations. Weak typing made data integrity fragile. The absence of enums meant constants scattered across files. Error handling was `false`-or-string return values all the way down. PHP 8.x addressed most of these at the language level, and the result is that writing a WordPress plugin in 2024 feels like writing software, not wrestling with a legacy runtime.

The deployment story reinforces the point. I shipped the TeamTailor Integrator as PHP files uploaded to a `wp-content/plugins` directory. No build step, no bundler, no CI pipeline required. It talks to an API, stores data through WordPress's own persistence layer, and runs its sync on a cron schedule. That is the entire stack. The whole thing is boring in exactly the way I want production systems to be boring.

## What I take from this

There is a pattern here that goes beyond PHP. The tools that get quietly good without rewriting themselves every eighteen months are the tools that accrue compounding value. They get to keep the lessons they have already learned. Their documentation stays accurate. Their senior engineers do not have to re-prove their seniority every release cycle.

PHP spent the last decade doing the unglamorous version of that. The result, with the aid of [Symfony](https://symfony.com/) underneath and Laravel on top, is the most batteries-included setup I have stumbled across. Routing, ORM, auth, queues, mail, caching, reactive UI, observability. It is all there in the box, written by people who agree on what good looks like. In 2024 that combination mostly gets out of my way and lets me ship, which is all I really want from a tool, and it is more rare than it should be.

[^1]: Vercel. (2023). [Next.js 13.4: App Router stable](https://nextjs.org/blog/next-13-4). Marks the formal stabilisation of the App Router and the start of the broader migration cost across the Next.js ecosystem.

[^2]: Bite Code. (2023). [The hype cycle is killing developer productivity](https://www.bitecode.dev/p/hype-cycles). An analysis of recurring hype cycles in software development, tracing the pattern from XML to NoSQL to microservices to SPAs.

[^3]: PHP Group. (2023). [PHP 8.3 release announcement](https://www.php.net/releases/8.3/en.php). Official release notes covering typed class constants, `json_validate()`, the `#[Override]` attribute, and related additions.

[^4]: Larabel, M. (2020). [PHP 8.0 performance benchmarks](https://www.phoronix.com/review/php-80-benchmarks). Phoronix. JIT compilation benchmarks across synthetic and application-level workloads.

[^5]: Spatie. [Open-source packages](https://spatie.be/open-source). The team maintains a large and actively-maintained portfolio of Laravel and PHP packages covering common application needs from permissions to backups to media handling.
