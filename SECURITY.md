# Security Policy

## Reporting a Vulnerability

If you believe you have discovered a security vulnerability in ReactEdge, please do not disclose it publicly.

Instead, please report it privately by opening a GitHub Security Advisory or by contacting the maintainers directly.

Please include:

- A description of the vulnerability.
- Steps to reproduce the issue.
- The affected component(s).
- Any potential impact.
- Suggested mitigations, if known.

We will acknowledge receipt as soon as possible and work with the reporter to investigate and resolve the issue.

## Supported Versions

ReactEdge is currently under active development.

Security fixes are applied to the latest development branch. Version-specific support policies will be introduced as the project matures.

## Security Philosophy

ReactEdge aims to minimise security risks by:

- Keeping components isolated and independently deployable.
- Validating configuration before deployment.
- Encouraging dependency auditing (e.g. `npm audit`, `composer audit`).
- Integrating with existing security tooling rather than replacing it.
- Continuously expanding Health Engine security validation capabilities.

Security is considered an ongoing process rather than a one-time activity.

Thank you for helping keep ReactEdge secure.
