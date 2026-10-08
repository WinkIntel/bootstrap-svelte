import { appendFileSync, mkdirSync, readFileSync, readdirSync, renameSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const packageName = '@winkintel/bootstrap-svelte';
const branches = ['main', 'codex/maintenance-1.x'];

export function releasePolicy({ name, version, channel, ref, sha }) {
    if (name !== packageName) throw new Error('Unexpected package name');
    // Build metadata is deliberately excluded: npm versions must identify one release artifact.
    const match =
        typeof version === 'string' &&
        version.length <= 128 &&
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(version);
    if (!match || match[4]?.split('.').some((part) => /^\d+$/.test(part) && part.length > 1 && part.startsWith('0'))) {
        throw new Error('Invalid release version');
    }
    const major = match[1];
    const prerelease = Boolean(match[4]);
    const allowed =
        (major === '2' && !prerelease && channel === 'latest') ||
        (major === '1' && !prerelease && channel === 'maintenance') ||
        (major === '2' && prerelease && channel === 'next');
    if (!allowed) throw new Error('Version does not match the release channel');
    const branch = major === '1' ? branches[1] : branches[0];
    if (ref !== `refs/heads/${branch}` && ref !== `refs/tags/v${version}`) throw new Error('Unapproved release ref');
    if (typeof sha !== 'string' || !/^[a-f0-9]{40}$/.test(sha)) throw new Error('Invalid source SHA');
    return { branch, name, version, channel, sha };
}

export function verifySourceHistory({ sha, branch }, cwd = process.cwd()) {
    if (!branches.includes(branch) || !/^[a-f0-9]{40}$/.test(sha)) throw new Error('Invalid source identity');
    const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    const approved = `refs/remotes/origin/${branch}`;
    const introduced = git('log', '-1', '--diff-filter=A', '--format=%H', approved, '--', 'scripts/release-policy.mjs');
    if (!introduced) throw new Error('Release policy is not installed on the approved branch');
    try {
        git('merge-base', '--is-ancestor', sha, approved);
    } catch {
        throw new Error('Source is not in the approved branch history');
    }
    try {
        git('merge-base', '--is-ancestor', introduced, sha);
    } catch {
        throw new Error('Source predates the release policy');
    }
}

function currentRelease() {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const release = releasePolicy({ ...pkg, channel: process.env.RELEASE_CHANNEL, ref: process.env.GITHUB_REF, sha: process.env.GITHUB_SHA });
    verifySourceHistory(release);
    const checkedOut = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    if (checkedOut !== release.sha) throw new Error('Checkout does not match the selected source SHA');
    return release;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const release = currentRelease();
    if (process.argv[2] === 'guard') {
        appendFileSync(process.env.GITHUB_OUTPUT, `version=${release.version}\n`);
        console.log(JSON.stringify(release));
    } else if (process.argv[2] === 'pack') {
        const directory = resolve(process.env.RELEASE_DIR);
        mkdirSync(directory, { recursive: true });
        if (readdirSync(directory).length) throw new Error('Release directory must be empty');
        const packed = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', directory], { encoding: 'utf8' }));
        const filename = `winkintel-bootstrap-svelte-${release.version}.tgz`;
        if (packed.length !== 1 || packed[0].filename !== filename || packed[0].name !== release.name || packed[0].version !== release.version) {
            throw new Error('Unexpected packed artifact');
        }
        const tarball = join(directory, 'release.tgz');
        renameSync(join(directory, filename), tarball);
        const digest = createHash('sha256').update(readFileSync(tarball)).digest('hex');
        appendFileSync(process.env.GITHUB_OUTPUT, `sha256=${digest}\n`);
        console.log(JSON.stringify({ ...release, sha256: digest }));
    } else {
        throw new Error('Expected guard or pack');
    }
}
