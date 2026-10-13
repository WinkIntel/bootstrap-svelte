// This entry point can only create the verified tag/release; it cannot publish npm.
import { appendFileSync } from 'node:fs';
import { repository, validateReport, ensureRelease, readyNpmLatest } from './release-page.mjs';

try {
    if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REPOSITORY !== repository)
        throw new Error('Release-page writes require this repository GitHub Actions context');
    const report = validateReport(JSON.parse(process.env.VERIFIED_RELEASE_REPORT ?? 'null'));
    const token = process.env.RELEASE_PAGE_TOKEN;
    if (!token) throw new Error('Release App is not configured; see RELEASE.md. No fallback token is allowed');
    const api = async (path, { method = 'GET', body } = {}) => {
        const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
            method,
            redirect: 'error',
            signal: AbortSignal.timeout(30000),
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10' },
            ...(body ? { body: JSON.stringify(body) } : {})
        });
        if (response.status === 404 && method === 'GET') return null;
        if (!response.ok) throw new Error(`GitHub ${method} ${path}: HTTP ${response.status}`);
        return response.json();
    };
    const npmLatest = await readyNpmLatest(report, async () => {
        const response = await fetch(`https://registry.npmjs.org/-/package/${encodeURIComponent(report.name)}/dist-tags`, {
            redirect: 'error',
            signal: AbortSignal.timeout(15000)
        });
        if (!response.ok) throw new Error(`Registry tags HTTP ${response.status}`);
        const tags = await response.json();
        return tags.latest;
    });
    const release = await ensureRelease(report, api, npmLatest);
    console.log(`Verified GitHub release: ${release.html_url}`);
    if (process.env.GITHUB_STEP_SUMMARY)
        appendFileSync(
            process.env.GITHUB_STEP_SUMMARY,
            `GitHub release: ${release.html_url}\n\nPublished source: ${report.sha}; npm version: ${report.version}.\n`
        );
} catch (error) {
    console.error(
        `GitHub release page is incomplete: ${error.message}. npm publication must not be repeated. Retry only release-page recovery for the original publish run and attempt.`
    );
    process.exitCode = 1;
}
