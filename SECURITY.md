# Security Policy

This repository is currently private while WinkIntel prepares Bootstrap Svelte for public release.

## Reporting a vulnerability

For now, report suspected vulnerabilities directly to the WinkIntel maintainers through the private repository or internal WinkIntel channels.

Before public release, WinkIntel should replace this placeholder with the final public security reporting process.

## Scope

Security review should include:

- package contents published by `npm pack --dry-run`
- generated `dist` files
- component behavior that touches DOM, focus management, portals, overlays, popovers, tooltips, or user-provided HTML
- dependency and license posture
