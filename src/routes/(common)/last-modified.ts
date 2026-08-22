import { execFileSync } from 'node:child_process';

/**
 * UTC ISO timestamp of the newest commit touching any of `paths`, or `fallback` when git
 * history is unavailable (no repository, shallow clone without matching commits, uncommitted files).
 */
export function lastModified(paths: string[], fallback: Date): string {
    try {
        const output = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore']
        }).trim();
        const date = output ? new Date(output) : null;
        if (date && !Number.isNaN(date.getTime())) return date.toISOString();
    } catch {
        // git is missing or this is not a repository: fall through to the fallback date.
    }

    return fallback.toISOString();
}
