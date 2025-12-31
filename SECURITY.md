# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Nasiry POS seriously. If you believe you have found a security vulnerability in this project, please report it to us as described below.

### Disclosure Policy

Please **DO NOT** create a public GitHub issue for security vulnerabilities. Instead, please report them privately.

### How to Report

1. **Email**: Send detailed information to security@nasiry.com.
2. **Details**: Include as much information as possible:
   - Type of issue (e.g., buffer overflow, SQL injection, XSS)
   - Full paths of source file(s) related to the manifestation of the issue
   - The location of the affected source code (tag/branch/commit or direct URL)
   - Any special configuration required to reproduce the issue
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if available)
   - Impact of the issue, including how an attacker might exploit the issue

### Response Timeline

- **Acknowledgement**: We will acknowledge receipt of your report within 48 hours.
- **Assessment**: We will confirm the vulnerability and determine its severity within 1 week.
- **Fix**: We will aim to release a patch or workaround as soon as possible, depending on complexity.

### Safe Harbor

If you follow these guidelines, we will not pursue legal action against you regarding your research. We appreciate your efforts to improve the security of our project!

## Security Best Practices

When deploying this application, please ensure:

1. **Environment Variables**: Never commit `.env` files to version control.
2. **HTTPS**: Always serve the application over HTTPS in production.
3. **Database**: Use strong passwords and restrict network access to your database.
4. **Updates**: Keep dependencies updated to their latest secure versions.
5. **API Keys**: Rotate API keys and secrets regularly.

Thank you for helping keep Nasiry POS secure!
