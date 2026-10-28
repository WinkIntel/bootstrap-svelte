# Security Policy

WinkIntel takes the security of Bootstrap Svelte seriously.

## Svelte baseline for 1.x

The 1.x maintenance line retains its Svelte `^5.29.0` peer requirement. For security, use Svelte **5.55.7 or later within 5.x**: 5.55.7 includes fixes for published [SSR spread-attribute](https://github.com/sveltejs/svelte/security/advisories/GHSA-pr6f-5x2q-rwfp) and [DOM-clobbering](https://github.com/sveltejs/svelte/security/advisories/GHSA-rcqx-6q8c-2c42) advisories, as well as earlier Svelte 5 fixes. Older accepted peer versions may remain vulnerable; satisfying the peer range is not a security assurance. Keep Svelte updated and review [upstream advisories](https://github.com/sveltejs/svelte/security/advisories). This guidance changes neither package metadata nor 1.x compatibility and is not a guarantee against future vulnerabilities.

## Reporting a vulnerability

Report suspected vulnerabilities privately through GitHub's vulnerability reporting flow for this repository when available, or contact the WinkIntel maintainers directly.

Please do not publicly disclose a suspected vulnerability until WinkIntel has had a reasonable opportunity to investigate and coordinate a fix.

## Scope

Security review should include:

- package contents published by `npm pack --dry-run`
- generated `dist` files
- component behavior that touches DOM, focus management, portals, overlays, popovers, tooltips, or user-provided HTML
- dependency and license posture
