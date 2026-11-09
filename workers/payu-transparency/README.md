# PayU transparency Worker

This directory contains the Cloudflare Worker used by the Just A Drop public ledger.

## Runtime contract

- Worker name: `payu-transparency`
- Public endpoint: `GET /api/public/transactions?from=YYYY-MM-DD&to=YYYY-MM-DD`
- Health endpoint: `GET /health`
- Read-only methods: `GET` and CORS preflight `OPTIONS`; other methods return `405`.
- PayU credentials are read only from the runtime secret bindings `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT`.
- Only captured payments are included. Successful refunds are deducted before totals are returned.
- The response is an explicit public projection; it does not return raw PayU records, contact details, UPI IDs, or bank data.

## Cache behavior and troubleshooting

- Successful transaction summaries are cached for up to five minutes at the Worker edge. Cache keys use only the requested `from` and `to` dates.
- Error responses use `Cache-Control: no-store` and are not cached.
- Send `Cache-Control: no-cache` (or `Pragma: no-cache`) to bypass the Worker cache. The explicit `fresh=1` query parameter is also supported and is useful for diagnostics.
- A successful forced-refresh request refreshes the shared edge cache, while its response to that caller is marked `no-store`.
- The Worker retries network errors and PayU HTTP 408, 429, and 5xx responses up to three total attempts with bounded backoff. It does not retry 400, 401, or 403 responses.
- A failed upstream request returns a stable error `code` and, when available, `upstreamStatus`. The logs capture an allowlisted, redacted error summary and safe request headers; they never record Authorization, merchant credentials, or raw transaction data.

Force a live PayU request:

```sh
curl --url 'https://payu-transparency.zhravann.workers.dev/api/public/transactions?from=2026-11-09&to=2026-11-09&fresh=1' \\
  -H 'accept: application/json' \\
  -H 'cache-control: no-cache' \\
  -H 'pragma: no-cache'
```

For HTTP 403, check whether PayU has enabled the Transaction Reporting API for the merchant account and confirm the production Key/Salt pair and signing scheme with PayU. Retrying a 403 will not resolve a permission or authentication rejection.

## Prerequisites

- Node.js supported by the current Wrangler release.
- Access to the Cloudflare account that owns the `payu-transparency` Worker.
- Wrangler CLI and permission to manage/deploy that Worker.

## Local development

1. From this directory, create your local secret file:

   ```sh
   cp .dev.vars.example .dev.vars
   ```

2. Replace the placeholder values in `.dev.vars` locally. Do not commit that file or share its contents.
3. Start the local Worker:

   ```sh
   npx wrangler dev
   ```

The committed example contains placeholders only. The real `.dev.vars` is excluded by the repository's `.gitignore`.

## Production secrets

Production credentials must be configured in Cloudflare, not in GitHub source, Wrangler configuration, GitHub Pages, or GitHub Actions variables.

To add or rotate a production secret, run these commands from this directory and enter each value at the interactive prompt:

```sh
npx wrangler secret put PAYU_MERCHANT_KEY
npx wrangler secret put PAYU_MERCHANT_SALT
```

Cloudflare's dashboard **Workers & Pages → payu-transparency → Settings → Variables and Secrets** can also be used to add each value using type **Secret**.

The Wrangler configuration declares the required secret names only. It contains no secret values. Deploy validation fails if either required secret is missing.

## Deploy

After authenticating Wrangler to the intended Cloudflare account and confirming that both production secrets are configured:

```sh
npx wrangler deploy
```

This updates the existing Worker named `payu-transparency`. Review the target account and deployment before running the command.

## Security rules

- Never commit `.dev.vars`, `.env`, credential files, API tokens, private keys, or real PayU values.
- Do not add secrets under Wrangler `vars`; use Cloudflare Secret bindings.
- Do not log request authorization headers, merchant credentials, raw PayU payloads, or payer contact data.
- Treat contributor display names as personal information. Only publish a shortened name when permission has been obtained; otherwise use the anonymous fallback.
- Keep public API changes explicit and reviewed. Do not add payment creation, refund, cancellation, or mutation endpoints to this read-only Worker.

## Validation

Check JavaScript syntax:

```sh
node --check src/index.js
```

Check the Wrangler configuration and Worker bundle without deploying:

```sh
npx wrangler deploy --dry-run
```

A dry run validates packaging; it does not test live PayU credentials or the reporting API.
