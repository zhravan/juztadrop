<samp>

<p align="center">
  <img src="assets/jad-cover.png" alt="Just-a-Drop" width="400" />
</p>

<h2 align="center">Small contributions. Shared impact.</h2>

<p align="center">
  A community initiative built around a simple idea: a little help, together, can make a difference.
</p>

<p align="center">
  <a href="https://zhravan.github.io/juztadrop/">Website</a>
  ·
  <a href="https://zhravan.github.io/juztadrop/transparency.html">Transparency</a>
  ·
  <a href="https://github.com/zhravan/juztadrop">Source</a>
</p>

<p align="center">
  <a href="https://github.com/zhravan/juztadrop/actions/workflows/validate.yml">
    <img src="https://github.com/zhravan/juztadrop/actions/workflows/validate.yml/badge.svg" alt="Validation" />
  </a>
  <a href="https://github.com/zhravan/juztadrop/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/zhravan/juztadrop" alt="MIT License" />
  </a>
</p>

<br>
<br>

## About

Just-a-Drop is a community initiative that brings people together to support those in need through small contributions.

This repository contains the public website and the transparency layer used to publish contribution and spending records. The goal is to keep the experience simple, lightweight and open for the community to inspect and improve.

The website is built with plain HTML, CSS and JavaScript. There is no frontend framework, package installation or build step.

## Run locally

**Requirements:** Git and Python 3.

```bash
git clone https://github.com/zhravan/juztadrop.git
cd juztadrop
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Project structure

```text
.
├── assets/                     # Site images, logo and favicon
├── data/
│   └── ledger.json             # Public, reviewed ledger records
├── workers/
│   └── payu-transparency/      # Read-only PayU reporting Worker
├── index.html                  # Home
├── story.html                  # Our story
├── contribute.html             # Get involved
└── transparency.html           # Public contribution records
```

## Transparency

The transparency page brings together two sources:

- **Public ledger:** reviewed records maintained in [`data/ledger.json`](data/ledger.json).
- **PayU reporting feed:** captured transaction data fetched through a read-only [Cloudflare Worker](workers/payu-transparency/).

The Worker keeps merchant credentials on the server and exposes only a restricted public view. It does not create payment orders, issue refunds or modify transactions.

The initial ledger is intentionally empty. Never add invented, estimated or unreconciled financial figures.

### Ledger example

The following is a schema illustration only. Do not copy it into the live ledger as a real transaction.

```json
{
  "id": "JAD-IN-0001",
  "type": "income",
  "status": "verified",
  "date": "2026-11-09",
  "amount": 30,
  "contributor": "Anonymous contributor",
  "reference": "PAY-••••123456",
  "description": "Community contribution"
}
```

Only verified records are included in the public ledger totals. Mask payment references and publish contributor names only with explicit permission. Never commit phone numbers, email addresses, UPI IDs, bank details, full transaction identifiers, private receipts or beneficiary information. Anything committed to the ledger is publicly accessible, whether or not the UI displays it.

## PayU Worker setup

The reporting Worker lives in [`workers/payu-transparency/`](workers/payu-transparency/).

**Requirements:** Node.js and Wrangler.

```bash
cd workers/payu-transparency
cp .dev.vars.example .dev.vars
npx wrangler dev
```

Add local development credentials to `.dev.vars` only when needed. This file is ignored by Git.

For production, configure `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT` as Cloudflare Worker **Secrets**. Never put merchant credentials in this repository, frontend code, GitHub Pages or public issue discussions.

See the [Worker README](workers/payu-transparency/README.md) for configuration, deployment and troubleshooting details.

## Deploy

**Website:** GitHub Pages deploys the repository root using GitHub Actions. In repository settings, select **Settings → Pages → Build and deployment → Source → GitHub Actions**. Push to `main` to trigger deployment.

**PayU Worker:** deployed separately to Cloudflare. It requires Cloudflare account access and the production PayU secrets described above.

## Contributing

Issues and pull requests are welcome. Documentation, accessibility, design, bug fixes and improvements to the transparency experience are all useful contributions.

- Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Report security issues privately as described in [SECURITY.md](SECURITY.md).
- Keep changes focused and explain how they were tested.
- Do not commit credentials, private keys, real personal data or unverified financial records.

## License

MIT

</samp>
