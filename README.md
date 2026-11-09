# JustADrop - Public Ledger

A lean, open-source transparency layer for the JustADrop community.

**Live site:** https://zhravan.github.io/juztadrop/

## What this publishes

- Verified contributions received (date, contributor display name, amount, payment reference)
- Itemised community spending with project, purpose, date, amount and supporting evidence
- Reconciled totals: received, utilised and remaining balance
- Public source data in `data/ledger.json`

The public ledger intentionally starts empty. Never add guessed, sample, or unreconciled financial figures.

## GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then Save.
4. The workflow in `.github/workflows/pages.yml` also supports automatic Pages deployments. In **Settings → Pages**, select **GitHub Actions** if using the workflow.

## Publishing ledger entries

Edit `data/ledger.json` and commit a reconciled entry. Example schema:

```json
{
  "id": "JAD-IN-0001",
  "type": "income",
  "status": "verified",
  "date": "2026-11-09",
  "contributor": "First name + surname initial (with consent) or Anonymous contributor",
  "contributor_id": "internal-non-identifying-key",
  "amount": 30,
  "reference": "PayU transaction reference",
  "description": "Community contribution",
  "proof_url": ""
}
```

For expenses, set `type` to `expense`, provide `project`, `description`, `notes`, and a public `proof_url` where appropriate. Do not publish bank account numbers, UPI IDs, phone numbers, email addresses, full payer identifiers, addresses, private receipts, or beneficiary-sensitive details. The `contributor` string is displayed publicly as entered (HTML-escaped, but not automatically shortened); use only a consented display name or `Anonymous contributor`.

The site computes the summary from verified entries. `status` must be `verified`; pending, failed or refunded payments must not be counted as received. Refunds and corrections should be represented as separate, clearly described ledger records rather than silently rewriting history.

## Cloudflare Worker source

The Cloudflare Worker source is version-controlled in [`workers/payu-transparency/`](workers/payu-transparency/). The deployed Worker is named `payu-transparency`; its entry point and required secret *names* are declared in `wrangler.jsonc`.

No PayU credential values or Cloudflare API tokens belong in this repository. Use Cloudflare Secret bindings for production and an untracked local `.dev.vars` file for local development. See the [Worker README](workers/payu-transparency/README.md) for setup, secret rotation and deployment instructions.

The `.dev.vars.example` file contains placeholders only. The root `.gitignore` excludes real `.dev.vars`, `.env`, Wrangler state and local credential files.

## PayU integration - read-only transparency feed

The public site is hosted on GitHub Pages. It reads the existing verified manual ledger from `data/ledger.json` and combines it at runtime with successful PayU transactions returned by the Cloudflare Worker:

`https://payu-transparency.zhravann.workers.dev/api/public/transactions`

The Worker is the only component that talks to PayU. It stores the PayU Merchant Key and Salt as Cloudflare Worker secrets, authenticates to PayU's transaction reporting API, and returns a sanitised list of captured transactions. The GitHub Pages frontend contains only the public Worker URL; it never receives PayU credentials. The current Worker derives a shortened display name whenever PayU returns a first/last name; the PayU response used here has no consent flag, and this code does not verify consent. Obtain and record contributor permission separately before publishing names. If permission is unavailable, keep contributions anonymous by removing the name mapping in the Worker.

This integration is intentionally read-only:
- It retrieves captured/successful transactions only and subtracts refunds that PayU marks as successfully processed; queued or pending refunds do not affect the total until PayU confirms success.
- It exposes a limited contributor display name (first name and surname initial, when PayU supplies them; otherwise `Anonymous contributor`), date, amount, payment mode, and masked reference.
- It does not create payment links or payment orders.
- It does not initiate refunds, cancellations, or transaction modifications.
- It does not publish full payer names, phone numbers, email addresses, UPI IDs, bank references, or raw PayU responses. The shortened name is still personal information.
- It does not write PayU data back into `data/ledger.json`; the feed is fetched live by the public page.

Configure `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT` only as Cloudflare Worker secrets. Never put them in HTML, JavaScript, JSON, Git history, or GitHub Pages. The PayU reporting credential must be rotated if it has been exposed. Public pages consume only the Worker’s sanitised GET endpoint.

## Data contract

Fields: `id`, `type` (`income|expense`), `status` (`verified|pending|failed|refunded`), `date` (YYYY-MM-DD), `amount` (INR numeric), plus optional `contributor`, `contributor_id`, `reference`, `description`, `project`, `notes`, `proof_url`.

## Licence

MIT - see [LICENSE](LICENSE).
