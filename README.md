# JustADrop — Public Ledger

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
  "contributor": "Display name or Anonymous",
  "contributor_id": "internal-non-identifying-key",
  "amount": 30,
  "reference": "PayU transaction reference",
  "description": "Community contribution",
  "proof_url": ""
}
```

For expenses, set `type` to `expense`, provide `project`, `description`, `notes`, and a public `proof_url` where appropriate. Do not publish bank account numbers, UPI IDs, phone numbers, email addresses, full payer identifiers, addresses, private receipts, or beneficiary-sensitive details.

The site computes the summary from verified entries. `status` must be `verified`; pending, failed or refunded payments must not be counted as received. Refunds and corrections should be represented as separate, clearly described ledger records rather than silently rewriting history.

## PayU integration — secure architecture

GitHub Pages is static hosting. **Never put PayU salt, client secret, merchant key with privileged access, webhook signing secret, or other credentials in HTML/JavaScript, JSON, Git history, or GitHub Pages.** A browser-only PayU integration cannot securely verify payment status.

Recommended flow:

1. The browser asks a server-side endpoint to create a PayU payment order.
2. The backend signs the request with PayU credentials stored as server-side secrets and returns the checkout details.
3. PayU redirects/webhooks to the backend.
4. The backend verifies the callback/hash and reconciles the transaction with PayU's transaction verification API.
5. Only verified, settled transactions are written to the public ledger. Never trust the browser redirect alone.
6. Publish a sanitised ledger record; keep raw webhook payloads and private payer details in restricted storage.

A small serverless backend (Cloudflare Workers, AWS Lambda, or equivalent) is required for this. Add secrets there, not in Pages. The public frontend already reads the published `data/ledger.json` feed.

## Data contract

Fields: `id`, `type` (`income|expense`), `status` (`verified|pending|failed|refunded`), `date` (YYYY-MM-DD), `amount` (INR numeric), plus optional `contributor`, `contributor_id`, `reference`, `description`, `project`, `notes`, `proof_url`.

## Licence

MIT — see [LICENSE](LICENSE).
