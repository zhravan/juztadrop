# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   |                    |
| < 1.0   |                    |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

**Email**: <shravan@ohmyscript.com>

**Response time**: Within 48 hours

### What to Include

- Type of vulnerability (SQL injection, XSS, etc.)
- Affected source files or endpoints
- Step-by-step reproduction steps
- Proof-of-concept (if possible)
- Impact assessment

## Disclosure Process

1. Confirm vulnerability and affected versions
2. Prepare fixes
3. Release security patch
4. Public disclosure (if applicable)

## Security Best Practices

### Required for Production

- Use strong `JWT_SECRET` (min 32 chars)
- Use strong `DB_PASSWORD`
- Never commit `.env.production`
- Enable HTTPS (automatic with Caddy)
- Use app-specific SMTP passwords
- Keep dependencies updated
- Firewall: Only ports 80, 443, 22

### Already Implemented

- Password hashing (bcrypt)
- JWT authentication
- Email verification
- Role-based access control
- Input validation (Zod)
- SQL injection prevention (Drizzle ORM)
- CORS configuration

## Contact

Security Email: <shravan@ohmyscript.com>

For general questions, open an issue.
