AGENTS

This repository uses automated agents and scripts to manage local development and deployment. This document explains the roles, permissions, and actions performed by each agent.

Agents

1. Local Dev (you)
   - Role: Develop and test the site locally.
   - Actions: run `npm install`, `npm run dev`, edit files, commit changes, run `npm run build`.

2. CI (GitHub Actions)
   - Role: Build and optionally deploy the site automatically on push to a branch.
   - Actions: check out code, run `npm ci`, `npm run build`, deploy `dist/` to `gh-pages` using `peaceiris/actions-gh-pages` or `gh-pages`.

3. Manual Deploy (gh-pages npm package)
   - Role: Push built `dist/` contents to the `gh-pages` branch from local machine.
   - Actions: `npm run deploy` (runs `gh-pages -d dist -b gh-pages`) — requires push permissions to the repo.

Notes

- The project's root contains a `CNAME` file which will be included in the `gh-pages` branch on deploy. Keep `CNAME` committed to the source branch used for building so the deploy step includes it.
- If you set up a CI workflow, ensure it preserves the CNAME by including it in the deployment step or by configuring the deploy action to copy it into `dist/` before pushing.

Security

- Deployment actions must run under a GitHub token with write permissions to `gh-pages` (use GITHUB_TOKEN or a deploy key).
- Avoid storing long-lived personal access tokens in the repo. Use GitHub Actions secrets.

Recommended next steps

- Create `.github/workflows/deploy.yml` to build and deploy from your chosen branch (example available on request).
- Ensure the build process includes copying `CNAME` to `dist/` before deploy.
- Remove any scripts that prevent scrolling globally (done).
