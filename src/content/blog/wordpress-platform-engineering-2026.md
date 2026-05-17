---
title: "State of WordPress 2026"
pubDate: 2026-04-30
excerpt: "PHP-native blocks in 7.0, a talent pipeline that is quietly drying up, and what it actually takes to run WordPress at scale in 2026."
tags: [WordPress]
heroImage: "/img/blog/wordpress-platform-engineering-2026.webp"
draft: false
---

As I am missing this year's WordCamp Porto, I wanted to recap the current state of WordPress and what I think actually matters for people building things with it right now.

I first touched WordPress in 2007 and have worked with it professionally for about a decade, which is long enough to watch the platform cycle through irrelevance, reinvention, and irrelevance again, sometimes in the same calendar year. WordPress survives every cycle because it occupies a position nothing else has dislodged: it is the only CMS that combines a usable admin, a mature plugin ecosystem, and the ability to run on a €5 VPS without a build step.

That position is not as secure as it looks. The surface metrics are fine (59.5% of the CMS market,[^1] a block editor that finally works, a plugin marketplace that still prints money), but the engineering talent that built the WordPress web is retiring out of the ecosystem faster than it is being replaced. The economics of maintaining a site at scale have shifted. And the community is quietly fracturing along lines most people outside it have not noticed yet.

This is what that landscape looks like from where I sit, and what I think is worth paying attention to.

## PHP-native blocks are the biggest thing coming

The most consequential change on the horizon is the move toward PHP-native blocks in WordPress 7.0, not a new default theme or a performance improvement.

Right now, building a custom block means Node.js, `wp-scripts`, webpack, React, and a build step. For a block that renders a heading with a background colour, that is an absurd amount of ceremony. The `@wordpress/create-block` scaffold works, but it assumes you are building a plugin, not adding a small piece of structured content to a site. The developer experience has been the block editor's weakest link since day one, and it is the reason a lot of competent PHP developers simply never engaged with Gutenberg beyond installing a page builder.

PHP-native blocks change that calculus. WordPress 7.0, which entered release candidate in May 2026, introduces PHP-only block registration.[^2] You call `register_block_type()` with `'supports' => array( 'autoRegister' => true )` and a `render_callback`, and the block appears in the editor automatically, with no JavaScript, no React, and no `wp-scripts` involved. The editor generates inspector controls from your block attributes (text inputs for strings, number inputs for integers, checkboxes for booleans, dropdowns for enums).[^3] It is the same `register_block_type()` API you have been using since WordPress 5.0, but without the JavaScript half being mandatory.

The implications are broader than convenience. A PHP-native block model means:

- Custom blocks become accessible to the entire WordPress developer population, not just the subset comfortable with React and a JavaScript toolchain.
- The performance profile improves because server-rendered blocks do not ship JavaScript to the front-end unless they explicitly need it.
- The maintenance burden drops because there is no `node_modules` directory to keep updated, no webpack config to debug, no breaking changes from the React ecosystem to track.
- Agencies can version-control block code the same way they version-control everything else, without maintaining a separate build pipeline for blocks.

The trade is that PHP-native blocks cannot do client-side interactivity without additional tooling. That is fine. Most blocks do not need client-side interactivity in the first place. A testimonial grid, a job listing, a call-to-action bar, a table of contents: these are server-rendered components that should never have shipped a JavaScript bundle. For the minority of blocks that do need interactivity, the Interactivity API (shipped in WordPress 6.5, with a new `watch()` function in 7.0[^4]) provides a standard, framework-agnostic way to add it.

If you maintain a WordPress site and have been avoiding custom blocks because the toolchain felt like overkill, 7.0 is the release that removes that excuse. Start familiarising yourself with `block.json` metadata and the render callback pattern now. The migration path from a JavaScript block to a PHP-native block is straightforward, and the payoff in reduced complexity is immediate.

## The block editor is good now. The tension is still there.

Gutenberg shipped in WordPress 5.0 in December 2018. The reception was hostile. The editor broke layouts, clashed with existing plugins, and forced a mental model shift nobody had asked for. Seven years later, the block editor is genuinely good. The Site Editor (full site editing) shipped in WordPress 5.9 in early 2022 and has matured into something non-technical users can actually use to build complete sites without touching a template file.

The tension is that FSE solves a problem the people maintaining WordPress sites at scale never had. Agencies and in-house teams already had template hierarchies, version-controlled theme code, and deployment pipelines. FSE replaces those with a database-stored block structure that is harder to audit, harder to diff, and harder to roll back. The trade is real: a non-technical site owner can now edit their header without calling a developer, but the developer who gets called when the header breaks has fewer tools to debug it.

The practical advice for agencies is straightforward. Use FSE for client sites where the client needs to make layout changes independently. Use classic themes or a hybrid approach for sites where you are responsible for ongoing maintenance and want the safety of version-controlled templates. The two models can coexist in the same WordPress install. You do not have to pick one and commit to it forever.

## The security surface is narrower than it feels, but the long tail is dangerous

WordPress's security reputation is worse than its actual track record, but the gap is narrowing. Core is reasonably well-audited. Automatic background updates for minor releases have been the default since 3.7. The Application Passwords feature introduced in 5.6 improved API authentication significantly.

The real attack surface is the plugin and theme ecosystem. Patchstack's 2026 State of WordPress Security report found that 4,100+ vulnerabilities were disclosed in 2024, of which 13% were highly exploitable.[^5] 33% of all vulnerabilities in the WordPress ecosystem receive no patch at all. The average exposure window, meaning the time between disclosure and a fix being applied, is 120 days.[^5]

What this means in practice:

- Audit your plugin count regularly. Every plugin is a potential liability. If you are running a site with forty active plugins, you are carrying forty potential attack surfaces, most of which you have not reviewed the source code of.
- Prefer plugins with a clear maintenance track record. A plugin that has been updated consistently for three years is safer than a plugin that was last touched in 2022, even if the latter has more features.
- Use WordPress Playground for pre-deployment testing. The WordPress Playground project runs WordPress entirely in the browser via WebAssembly. You can spin up a disposable instance, install the plugins you are evaluating, and test for conflicts or suspicious behaviour without touching a real server. It is not a replacement for a staging environment, but it lowers the barrier to due diligence.
- Auto-updates for plugins are worth enabling now. The feature shipped in WordPress 6.6 and has matured. 60%+ of attacks exploit vulnerabilities with patches available but not applied.[^5] For plugins from reputable sources, the risk of an auto-update breaking your site is lower than the risk of leaving a known vulnerability unpatched.

AI-assisted plugin development complicates this picture in both directions. On the supply side, LLMs let competent PHP developers ship boilerplate faster, which is genuinely useful. On the risk side, AI-generated plugin code has been showing up with the exact failure patterns you would expect from uncritical LLM use, including string-concatenated SQL queries, missing capability checks, and exposed bearer tokens. The CVE-2025-11749 disclosure in the popular AI Engine plugin's Model Context Protocol settings is the cleanest recent illustration: a No-Auth URL feature leaked bearer tokens through the `/wp-json/` REST API, exposing more than 100,000 sites to unauthenticated privilege escalation.[^ai-engine] Patchstack's 2025 report tracked an overall 42% year-on-year jump in WordPress ecosystem vulnerabilities, with 91% of them in plugins rather than core.[^patchstack-2025] AI does not, however, have to be the cause of every new disclosure for it to be a credible accelerant.

## What the project is actually doing about AI

Outside the security side of the conversation, there is a real and credible body of work happening on the official AI front. The Make WordPress AI team has been shipping under the banner of "AI Building Blocks", a set of standards intended to let WordPress sites participate in agentic workflows on the same terms as any modern application.[^wp-ai-building-blocks] The three pieces that matter so far are the **Abilities API**, a uniform way for plugins to expose what they can do to AI clients; the **MCP Adapter**, which turns any Abilities-API plugin into a [Model Context Protocol](/blog/model-context-protocol/) server with very little additional work; and the **PHP AI Client SDK**, a server-side wrapper around the major model providers.[^wp-mcp-adapter] WordPress 6.9 is the release where this stack lands together.

The practical implication is that a self-hosted WordPress install can be made addressable by Claude, ChatGPT, Cursor, or any other MCP-capable agent without depending on WordPress.com or a third-party plugin. That is the kind of unglamorous infrastructure work the project has historically done well, and a more credible long-term position than chasing every AI feature that gets bolted onto a hosted competitor.

## The hosting market has commoditised. The interesting shift is headless.

Managed WordPress hosting is a commodity. WP Engine, Kinsta, Flywheel, Pantheon, and Cloudways all offer essentially the same product: Nginx, PHP-FPM, Redis object cache, a CDN, automated backups, and a staging environment. The differentiation is mostly in the control panel UX and the support quality. The price range is wide enough to be confusing, anywhere from €20 to €185 per month for essentially the same technical stack, but the market has settled into a pattern where you pay for the support contract and the interface rather than the infrastructure.

The interesting shift is toward serverless and headless WordPress. WordPress on Vercel via Faust.js, wp-graphql on Netlify, and various setups that decouple the admin from the front-end. These architectures solve real problems (better performance, smaller attack surface, easier scaling) but they also reintroduce the build step that WordPress was designed to eliminate.

The headless approach makes sense if you already have a front-end engineering team. It makes less sense for the solo site owner or the three-person agency that chose WordPress specifically to avoid maintaining a separate front-end application. The industry has a tendency to treat headless as an upgrade in all cases, when in practice it is a trade that favours teams with engineering capacity.

If you are considering headless, ask yourself: do you have someone on the team who can maintain a React or Next.js application full-time? If the answer is no, headless will increase your maintenance burden, not decrease it. The WordPress admin is still the best CMS interface for non-technical editors. Do not give that up unless the performance or security requirements genuinely justify it.

## The talent pipeline is the real problem

This is the part that worries me most.

The WordPress ecosystem was built by people who learned PHP in the early 2000s, cut their teeth on Drupal or Joomla, and moved to WordPress because it had a lower barrier to entry and a larger market. That cohort is aging out. The developers entering the industry now learn React, TypeScript, and Node.js. PHP is not part of the standard curriculum. WordPress is not part of the standard curriculum.

The result is a growing gap between the supply of WordPress engineers and the demand for WordPress maintenance. Agencies report longer hiring cycles for WordPress roles. Rates for competent WordPress developers have risen faster than general web development rates. The work itself has not become more complex. The pool of people willing to do it has shrunk.

PHP-native blocks in 7.0 are a direct response to this problem. They lower the barrier to entry for developers who know PHP but never learned the React toolchain. That is the right architectural move, but it is not sufficient on its own. The ecosystem also needs:

- Better onboarding documentation that does not assume a decade of WordPress context. The Developer Blog and Learn WordPress have improved, but the signal-to-noise ratio is still low compared to the documentation ecosystems around Laravel or Astro.
- A credible story for developers who want to build a career on WordPress without working at an agency. The freelance and agency track is well-established. The product engineering track (building and selling plugins, working on core, contributing to the open-source project) is less visible and harder to enter.
- Recognition that the next generation of WordPress developers will come from outside the traditional PHP community. They will come from front-end backgrounds, from Laravel shops, from static site ecosystems. The platform needs to meet them where they are, not expect them to learn the ecosystem's history before they can be productive.

## What to do between now and 7.0

If you maintain WordPress sites professionally, here is what I think is worth your attention between now and the 7.0 release:

1. Start using `block.json` metadata now. Even if you are not building custom blocks yet, understanding the block metadata standard will make the transition to PHP-native blocks seamless. The schema is well-documented and does not change between versions.

2. Audit your plugin count and replace abandoned plugins. Every plugin that has not been updated in two years is a candidate for replacement. The effort of migrating to a maintained alternative is lower than the cost of a security incident.

3. Evaluate whether FSE or classic themes serve your clients better. The answer will be different for different clients. Make the decision explicit rather than defaulting to whatever the last tutorial recommended.

4. Learn the Interactivity API. If you do need client-side interactivity in a block, the Interactivity API is the standard way to add it. It is framework-agnostic, well-documented, and will be the recommended approach going forward.

5. Recognise that running WordPress at scale is platform-engineering work. The depth that actually goes into a serious production WordPress install (server provisioning, security review, plugin auditing, CI/CD, MarTech integration, performance tuning, headless or hybrid front-ends where they fit) is the same depth that goes into any senior platform role. The agencies and employers that price it as junior PHP work are the same ones complaining loudest about the talent shortage they are creating.

The web still runs on WordPress, and that is not going to change this year or next. But the quality of the WordPress web in 2030 depends on decisions the community makes now about who it welcomes, how it teaches, and what it prioritises. The platform itself is in decent shape; the pipeline of people who can build on it is the part that needs the attention. PHP-native blocks are a step in the right direction, and one step in a longer walk.

[^1]: W3Techs. (2026). [Usage statistics of content management systems](https://w3techs.com/technologies/overview/content_management). WordPress CMS market share as of May 2026.

[^2]: WordPress Core. (2026). [WordPress 7.0 Field Guide](https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/). PHP Only Block Registration (Section 8a).

[^3]: WordPress Core. (2026). [PHP-only block registration](https://make.wordpress.org/core/2026/03/03/php-only-block-registration/). Details on `autoRegister`, supported attribute types, and editor control generation.

[^4]: WordPress Core. (2026). [Changes to the Interactivity API in WordPress 7.0](https://make.wordpress.org/core/2026/02/23/changes-to-the-interactivity-api-in-wordpress-7-0/). Introduction of the `watch()` function.

[^5]: Patchstack. (2026). [State of WordPress Security 2026](https://patchstack.com/whitepaper-2026/). 4,100+ vulnerabilities disclosed in 2024, 13% highly exploitable, 33% receive no patch, 120-day average exposure window, 60%+ of attacks exploit unapplied patches.

[^ai-engine]: eSecurity Planet. (2025). [AI Engine Flaw Exposes 100,000 WordPress Sites to Attack](https://www.esecurityplanet.com/threats/news-wordpress-vulnerability-100k-impact/). Reports on CVE-2025-11749, published 4 November 2025.

[^patchstack-2025]: Patchstack. (2025). [State of WordPress Security in 2025](https://patchstack.com/whitepaper/state-of-wordpress-security-in-2025/). 11,334 new ecosystem vulnerabilities in 2025 (42% year-on-year increase); 91% in plugins.

[^wp-ai-building-blocks]: Make WordPress AI. (2025). [AI Building Blocks for WordPress](https://make.wordpress.org/ai/2025/07/17/ai-building-blocks/). Project announcement, 17 July 2025.

[^wp-mcp-adapter]: WordPress Developer Blog. (2026). [From Abilities to AI Agents: Introducing the WordPress MCP Adapter](https://developer.wordpress.org/news/2026/02/from-abilities-to-ai-agents-introducing-the-wordpress-mcp-adapter/). Published February 2026.
