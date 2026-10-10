// Shared inputs for the build policy and actual protected workflow verifier.
// Non-string manifest versions fail the workflow identity check first because env values are strings.
export const policyInput = { name: '@winkintel/bootstrap-svelte', version: '2.1.1', channel: 'latest', ref: 'refs/heads/main', sha: 'a'.repeat(40) };
export const policyCases = [
    ['2.x branch', {}, true],
    ['2.x tag', { ref: 'refs/tags/v2.1.1' }, true],
    ['1.x branch', { version: '1.1.1', channel: 'maintenance', ref: 'refs/heads/codex/maintenance-1.x' }, true],
    ['1.x tag', { version: '1.1.1', channel: 'maintenance', ref: 'refs/tags/v1.1.1' }, true],
    ['prerelease branch', { version: '2.2.0-rc.1', channel: 'next' }, true],
    ['prerelease tag', { version: '2.2.0-rc.1', channel: 'next', ref: 'refs/tags/v2.2.0-rc.1' }, true],
    ['maximum-length version', { version: '2.1.1-' + 'a'.repeat(122), channel: 'next' }, true],
    ['wrong name', { name: 'other' }, false, /Unexpected package name/, /Package identity mismatch/],
    ['1.x on latest', { version: '1.1.1' }, false, /Version does not match the release channel/, /Version\/channel mismatch/],
    ['2.x on maintenance', { channel: 'maintenance' }, false, /Version does not match the release channel/, /Version\/channel mismatch/],
    ['stable on next', { channel: 'next' }, false, /Version does not match the release channel/, /Version\/channel mismatch/],
    ['prerelease on latest', { version: '2.2.0-rc.1' }, false, /Version does not match the release channel/, /Version\/channel mismatch/],
    [
        '1.x prerelease',
        { version: '1.2.0-rc.1', channel: 'next', ref: 'refs/heads/codex/maintenance-1.x' },
        false,
        /Version does not match the release channel/,
        /Version\/channel mismatch/
    ],
    ['unknown major', { version: '3.0.0' }, false, /Version does not match the release channel/, /Version\/channel mismatch/],
    ['unknown channel', { channel: 'beta' }, false, /Version does not match the release channel/, /Version\/channel mismatch/],
    ['feature branch', { ref: 'refs/heads/feature' }, false, /Unapproved release ref/, /Unapproved source ref/],
    ['wrong branch', { ref: 'refs/heads/codex/maintenance-1.x' }, false, /Unapproved release ref/, /Unapproved source ref/],
    ['tag mismatch', { ref: 'refs/tags/v2.1.2' }, false, /Unapproved release ref/, /Unapproved source ref/],
    ['pull request ref', { ref: 'refs/pull/1/merge' }, false, /Unapproved release ref/, /Unapproved source ref/],
    ['leading zero', { version: '2.01.1' }, false, /Invalid release version/, /Invalid release version/],
    ['missing patch', { version: '2.1' }, false, /Invalid release version/, /Invalid release version/],
    ['leading zero prerelease', { version: '2.1.1-01', channel: 'next' }, false, /Invalid release version/, /Invalid release version/],
    ['build metadata', { version: '2.1.1+build' }, false, /Invalid release version/, /Invalid release version/],
    ['shell input', { version: '2.1.1;touch /tmp/not-allowed' }, false, /Invalid release version/, /Invalid release version/],
    ['newline channel', { channel: 'latest\nother=value' }, false, /Version does not match the release channel/, /Version\/channel mismatch/],
    ['overlong version', { version: '2.1.1-' + 'a'.repeat(123), channel: 'next' }, false, /Invalid release version/, /Invalid release version/],
    ['non-string version', { version: 2 }, false, /Invalid release version/, /Package identity mismatch/],
    ['invalid SHA', { sha: 'HEAD' }, false, /Invalid source SHA/, /Invalid source SHA/],
    ['missing SHA', { sha: undefined }, false, /Invalid source SHA/, /Invalid source SHA/]
];
