# Just-a-Drop

<p align="center">
  <img src="https://raw.githubusercontent.com/zhravan/juztadrop/main/assets/jad-cover.png" alt="Just-a-Drop" width="360" />
</p>

<p align="center">
  Small contributions. Shared impact.
</p>

<p align="center">
  <a href="https://zhravan.github.io/juztadrop/">Website</a> ·
  <a href="https://zhravan.github.io/juztadrop/transparency.html">Transparency</a> ·
  <a href="CONTRIBUTING.md">Contribute</a>
</p>

---

Just-a-Drop is a community initiative that brings people together to support people in need through small contributions.

This repository contains the website and its public transparency layer. It is built with plain HTML, CSS and JavaScript.

## Run locally

Requires Git and Python 3.

```bash
git clone https://github.com/zhravan/juztadrop.git
cd juztadrop
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Transparency

The transparency page combines reviewed records from [`data/ledger.json`](data/ledger.json) with captured payment data from the read-only PayU reporting Worker.

The Worker runs separately on Cloudflare. Configure `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT` as Cloudflare **Secrets**. Never commit merchant credentials or private payment data.

See [workers/payu-transparency/README.md](workers/payu-transparency/README.md) for Worker setup.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
