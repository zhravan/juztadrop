# Security Policy

## Supported code

Security reports are welcome for the current default branch and the live website/Worker configuration maintained by this repository.

## Reporting a vulnerability

**Please do not report exploitable security vulnerabilities in a public GitHub issue, discussion or pull request.**

Use GitHub's private vulnerability reporting feature for this repository when it is enabled. Otherwise, email **justadrop2020@gmail.com** with the subject line `[Security] Juzt A Drop vulnerability report`.

Include, where possible:

- A short description of the issue and its potential impact.
- The affected page, file, endpoint or component.
- Minimal reproduction steps or a proof of concept that does not access real users' data.
- Any suggested mitigation.

Please do not include real PayU credentials, payment details, personal data or other secrets in the report. Redact tokens, request headers and identifiers from screenshots and logs.

We will review reports and coordinate a fix and disclosure with the reporter. Please allow maintainers time to investigate before sharing details publicly. There is no guaranteed response or remediation SLA.

## Scope and boundaries

The public site and PayU reporting endpoint are designed to be read-only. Do not test against real payer or beneficiary data, attempt unauthorized payment actions, perform denial-of-service testing, or access accounts and systems you do not own or have explicit permission to test.

For general bugs and non-sensitive feature requests, use the repository's public issue tracker.
