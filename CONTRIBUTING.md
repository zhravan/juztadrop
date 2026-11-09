# Contributing

Thanks for considering a contribution to Just-a-Drop. Small, focused improvements are welcome, including documentation, accessibility, responsive layout, bug fixes, security hardening and tests.

## Before you start

- Read the [README](README.md) to understand the static-site and PayU Worker architecture.
- Read the [Code of Conduct](CODE_OF_CONDUCT.md).
- Search existing [issues](https://github.com/zhravan/juztadrop/issues) and pull requests so work is not duplicated.
- For substantial changes, open an issue first to discuss scope and the expected user impact.

## Local setup

The website has no frontend build step or dependency installation requirement:

```sh
git clone https://github.com/zhravan/juztadrop.git
cd juztadrop
python3 -m http.server 8000
```

Visit <http://localhost:8000>.

The Cloudflare Worker is a separate project under `workers/payu-transparency/`. Follow its [README](workers/payu-transparency/README.md) for local development. Never use production credentials in a development environment.

## Suggested workflow

1. Fork the repository.
2. Create a focused branch from `main`, for example `fix/transparency-mobile-layout` or `docs/local-setup`.
3. Make the smallest change that solves the problem.
4. Run the relevant checks below and manually review the affected page at desktop and mobile widths.
5. Commit with a clear message and open a pull request against `main`.
6. Explain the problem, the approach, user-visible impact and validation performed.

## Checks

Run the checks relevant to your changes:

```sh
# Validate the public ledger JSON
python3 -m json.tool data/ledger.json > /dev/null

# Validate the Cloudflare Worker JavaScript syntax
node --check workers/payu-transparency/src/index.js

# Validate the Wrangler JSONC file (this repository currently uses valid JSON syntax)
python3 -m json.tool workers/payu-transparency/wrangler.jsonc > /dev/null
```

For HTML/CSS/JavaScript/Markdown changes, keep formatting consistent with the existing files. The repository uses Prettier; you can format changed files with:

```sh
npx --yes prettier@3.6.2 --write path/to/changed-file
```

The GitHub Actions validation workflow runs on pushes and pull requests. The Pages workflow only deploys the site; it does not reformat or commit changes back to your branch.

## Public-data and privacy rules

This repository is public, and GitHub Pages publishes the website files—including `data/ledger.json`—to everyone.

- Never commit PayU merchant keys or salts, Cloudflare API tokens, passwords, private keys, `.env` files or real `.dev.vars` files.
- Never put secrets in HTML, JavaScript, JSON, workflow files, issue comments, screenshots or commit messages.
- Never use real payer, contributor or beneficiary data in test fixtures, example records or screenshots.
- Do not add unmasked references, bank details, UPI IDs, phone numbers, email addresses, residential addresses, identity documents or private receipts.
- Do not publish a contributor name unless permission to display it has been obtained and recorded. Otherwise use `Anonymous contributor`.
- Ledger changes must be based on reconciled source records. Do not add made-up, sample or estimated amounts to the live ledger.
- Do not expose raw PayU API responses or add payment mutation endpoints to the public Worker.

If a proposed change requires sensitive data, describe the required data shape with synthetic values instead.

## Pull request expectations

A good pull request should:

- Have one clear purpose and a descriptive title.
- Include before/after screenshots for material visual changes, with all personal information removed.
- Explain any changes to the public data contract or API behavior.
- Include or update documentation when setup, behavior or configuration changes.
- State what was tested and what could not be tested.
- Confirm that no secrets or private data were added.

Maintainers may request changes, additional context or tests before merging. By submitting a contribution, you agree that it may be distributed under the repository's [MIT License](LICENSE).
