# Security Policy

WinkIntel takes the security of Bootstrap Svelte seriously.

## Svelte baseline

The 2.x development line requires Svelte `^5.55.7`. Version 5.55.7 includes the fixes for published [SSR spread-attribute](https://github.com/sveltejs/svelte/security/advisories/GHSA-pr6f-5x2q-rwfp) and [DOM-clobbering](https://github.com/sveltejs/svelte/security/advisories/GHSA-rcqx-6q8c-2c42) advisories affecting earlier 5.x versions. Keep Svelte updated and review [upstream advisories](https://github.com/sveltejs/svelte/security/advisories); this baseline is not a guarantee against future vulnerabilities.

## Reporting a vulnerability

Report suspected vulnerabilities privately through GitHub's vulnerability reporting flow for this repository when available, or contact the WinkIntel maintainers directly.

Please do not publicly disclose a suspected vulnerability until WinkIntel has had a reasonable opportunity to investigate and coordinate a fix.

## Scope

Security review should include:

- package contents published by `npm pack --dry-run`
- generated `dist` files
- component behavior that touches DOM, focus management, portals, overlays, popovers, tooltips, or user-provided HTML
- dependency and license posture
