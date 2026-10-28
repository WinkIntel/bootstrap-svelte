import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function svelteMinimum(range) {
    const match = typeof range === 'string' && /^\^(5\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))$/.exec(range);
    if (!match) throw new Error('Expected a stable Svelte 5 caret peer requirement');
    return match[1];
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    console.log(svelteMinimum(pkg.peerDependencies.svelte));
}
