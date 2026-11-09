# Just-a-Drop

[![MIT License](https://img.shields.io/github/license/zhravan/juztadrop)](LICENSE)
[![GitHub Pages deployment](https://github.com/zhravan/juztadrop/actions/workflows/pages.yml/badge.svg)](https://github.com/zhravan/juztadrop/actions/workflows/pages.yml)

An open-source website and public transparency ledger for the Just-a-Drop community.

- **Live website:** <https://zhravan.github.io/juztadrop/>
- **Source code:** <https://github.com/zhravan/juztadrop>
- **License:** [MIT](LICENSE)

## What is this project?

Just-a-Drop publishes the community website and a public view of recorded contributions and spending. The site is intentionally lightweight: static HTML, CSS and JavaScript, with no frontend framework or build step.

The transparency page combines two sources:

1. **Published ledger records** in [`data/ledger.json`](data/ledger.json), maintained as reviewed and reconciled records.
2. **PayU transaction reporting**, fetched at runtime from a read-only Cloudflare Worker. The Worker keeps PayU credentials server-side and returns a limited public projection of captured transactions.

The repository contains the website, public ledger schema/data, Worker source, deployment workflow and contributor documentation. Production PayU credentials and Cloudflare account configuration are not part of the source repository.

## Pages

| Page | Purpose |
| --- | --- |
| [Home](index.html) | Introduction to Just-a-Drop and a high-level activity summary |
| [Our story](story.html) | Background and project context |
| [Volunteer](contribute.html) | Ways to get involved |
| [Transparency](transparency.html) | Public contributions, spending and reconciled totals |

## Architecture

```text
Visitor's browser
      |
      +------ GitHub Pages ------ HTML / CSS / JavaScript
      |                             |
      |                             +-- data/ledger.json
      |
      +------ Cloudflare Worker -- GET /api/public/transactions
                                      |
                                      +-- PayU reporting API
                                          (server-side credentials)
```

- **Website hosting:** GitHub Pages serves the static files from the `main` branch.
- **Manual ledger:** `data/ledger.json` is a public file. Anything committed there can be read by anyone.
- **Payment transparency feed:** the frontend calls the public, read-only Worker at `https://payu-transparency.zhravann.workers.dev`.
- **PayU credentials:** the Worker reads `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT` from Cloudflare Secret bindings. They must never be placed in the frontend, repository, or GitHub Pages settings.
- **No payment mutations:** this integration reads transaction reports. It does not create payment orders, issue refunds, or modify PayU transactions.

The frontend currently requests the PayU reporting feed from **9 November 2026** onward. The start date is configured in the page source and should only be changed alongside a reviewed reconciliation plan.

## Run the website locally

No package installation or frontend build is required. Serve the repository root over HTTP (opening the HTML files directly with `file://` will prevent some browser requests from working).

```sh
git clone https://github.com/zhravan/juztadrop.git
cd juztadrop
python3 -m http.server 8000
```

Open <http://localhost:8000>.

The static pages load the published JSON ledger. The local website currently points to the deployed public PayU Worker; running the Worker locally is a separate step and does not automatically rewire the frontend to the local Worker.

### Develop the Cloudflare Worker

The Worker is maintained in [`workers/payu-transparency/`](workers/payu-transparency/).

Requirements: Node.js and Wrangler. From the Worker directory:

```sh
cd workers/payu-transparency
cp .dev.vars.example .dev.vars
```

Replace the placeholders in `.dev.vars` with **local development credentials only**, then start the local Worker:

```sh
npx wrangler dev
```

The actual `.dev.vars` file is ignored by Git. Never use production merchant credentials for local experiments unless your PayU account owner has explicitly approved that use. See the [Worker README](workers/payu-transparency/README.md) for secret setup, cache behavior, troubleshooting and deployment.

## Public ledger data

The initial ledger is intentionally empty. Do not add invented, example, estimated or unreconciled financial figures to the live data file.

A ledger entry has this shape:

```json
{
  "id": "JAD-IN-0001",
  "type": "income",
  "status": "verified",
  "date": "2026-11-09",
  "amount": 30,
  "contributor": "First name + surname initial (only with permission)",
  "reference": "PAY-••••123456",
  "description": "Community contribution"
}
```

Supported fields include:

- `id`: unique public record identifier.
- `type`: `income` or `expense`.
- `status`: `verified`, `pending`, `failed` or `refunded`. Only verified records are included in the public totals.
- `date`: date in `YYYY-MM-DD` format.
- `amount`: non-negative numeric amount in INR.
- `contributor`, `reference`, `description`, `project`, `notes`, `proof_url`: optional public display and audit fields.

For an expense, use `type: "expense"` and include a clear project/purpose description. Add a public proof link only when the document is safe to publish and does not expose personal, banking or beneficiary information.

### Publishing and correcting records

1. Reconcile the amount against the source record before marking it verified.
2. Add only the information that is necessary for public accountability.
3. Check that a reference is masked and that any contributor display name has explicit permission.
4. Review totals and supporting evidence before merging.
5. Record refunds and corrections transparently; do not silently rewrite history to hide a previous entry.

Do not publish full payer or beneficiary names, phone numbers, email addresses, UPI IDs, bank account details, unmasked transaction identifiers, residential addresses, private receipts, identity documents or internal-only identifiers. The ledger JSON is served publicly, so a field is not private simply because the UI does not display it.

### PayU feed and privacy

The Worker returns a restricted set of fields for captured transactions: date, amount, payment mode, masked reference and a contributor label. Successful refunds reported by PayU are deducted from the transaction amount; pending or unsuccessful refunds are not treated as completed.

The Worker currently derives a shortened display name from PayU's first and last name fields when available. PayU's reporting response does not provide a consent flag, so the integration cannot establish consent automatically. Obtain and record permission separately before displaying a contributor's name. Otherwise, change the display to `Anonymous contributor`. A shortened name is still personal information.

The Worker does not publish raw PayU responses, phone numbers, email addresses, UPI IDs or bank details. Its endpoint is public and read-only; treat all returned fields as public.

## Deployment

### GitHub Pages

1. Open **Settings → Pages** in the repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push changes to `main`, or run the Pages workflow manually from the **Actions** tab.

The workflow deploys the repository root as the static site. It does not need a PayU key, Cloudflare API token or other deployment secret.

### Cloudflare Worker

The Worker is deployed separately from GitHub Pages. Production deployment requires Cloudflare account access and the two PayU values provisioned as Worker **Secrets**. Follow the steps in [`workers/payu-transparency/README.md`](workers/payu-transparency/README.md).

Do not add Cloudflare deployment tokens to this public repository. If you later add automated Worker deployment from GitHub Actions, use narrowly scoped repository Actions secrets such as `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`; never put their values in workflow YAML.

## Contributing

Contributions are welcome—documentation improvements, accessibility fixes, bug reports, design refinements, tests and security improvements are all useful.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report security issues privately using the instructions in [SECURITY.md](SECURITY.md).

A few project-specific rules:

- Keep the site lightweight and avoid adding a frontend framework or build system without a clear need.
- Keep changes focused and explain how they were tested.
- Never commit credentials, tokens, private keys, local `.dev.vars` or production data exports.
- Never use real personal or payment data as test fixtures.
- Do not publish or alter real ledger records without source verification and the required permission.
- Preserve the read-only boundary of the public PayU Worker.

## License

This project is licensed under the [MIT License](LICENSE).
