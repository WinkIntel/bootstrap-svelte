# Security Policy

WinkIntel takes the security of Bootstrap Svelte seriously.

## Reporting a vulnerability

Report suspected vulnerabilities privately through GitHub's vulnerability reporting flow for this repository when available, or contact the WinkIntel maintainers directly.

Please do not publicly disclose a suspected vulnerability until WinkIntel has had a reasonable opportunity to investigate and coordinate a fix.

## Scope

Security review should include:

- package contents published by `npm pack --dry-run`
- generated `dist` files
- component behavior that touches DOM, focus management, portals, overlays, popovers, tooltips, or user-provided HTML
- dependency and license posture
