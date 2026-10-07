import { spawnSync } from 'node:child_process';
import { describe, expect, test } from 'vitest';
import { acceptPatterns } from './accept-patterns.js';
import { addAgentRoutes } from './vercel-agent-routes.js';

// A test-runner timeout cannot interrupt a synchronous RegExp. Keep the matching in a separately
// killable process, including compilation, and never send these inputs to a deployed site.
const MATCH_BUDGET_MS = 250;
const CHILD_TIMEOUT_MS = 2000;
const worker = `
    let data = '';
    for await (const chunk of process.stdin) data += chunk;
    const { patterns, inputs, budget } = JSON.parse(data);
    const results = [];
    for (const [name, source] of patterns) {
        const pattern = new RegExp(source);
        for (const input of inputs) {
            const started = performance.now();
            pattern.test(input);
            const ms = performance.now() - started;
            results.push({ name, length: input.length, ms });
            if (ms > budget) {
                console.log(JSON.stringify(results));
                process.exit(0);
            }
        }
    }
    console.log(JSON.stringify(results));
`;

function expectBoundedMatching(patterns: [string, string][], inputs: string[]) {
    const child = spawnSync(process.execPath, ['--input-type=module', '-e', worker], {
        input: JSON.stringify({ patterns, inputs, budget: MATCH_BUDGET_MS }),
        encoding: 'utf8',
        timeout: CHILD_TIMEOUT_MS,
        killSignal: 'SIGKILL',
        maxBuffer: 1024 * 1024
    });
    expect(child.error, `Regex worker failed or exceeded ${CHILD_TIMEOUT_MS} ms: ${child.stderr}`).toBeUndefined();
    expect(child.status, child.stderr).toBe(0);
    const results = JSON.parse(child.stdout) as { name: string; length: number; ms: number }[];
    for (const result of results) {
        expect(result.ms, `${result.name}, ${result.length} characters`).toBeLessThan(MATCH_BUDGET_MS);
    }
    expect(results).toHaveLength(patterns.length * inputs.length);
}

const patterns: [string, string][] = Object.entries(acceptPatterns).flatMap(([name, value]) =>
    Array.isArray(value) ? value.map((pattern, index): [string, string] => [`${name}[${index}]`, pattern]) : [[name, value]]
);

describe('static routing regex work stays bounded', () => {
    test.each([
        ['ordinary parameters', '; a=1 '],
        ['empty parameters', '; '],
        ['whitespace-only parameters', ';   '],
        ['quality parameters', ';q=1 ']
    ])('%s do not multiply backtracking paths', (_name, parameter) => {
        const inputs = [8, 32, 128, 512, 2048].flatMap((count) => [
            `text/markdown${parameter.repeat(count)};q=0`,
            `text/html${parameter.repeat(count)};q=0, text/markdown;q=0.5`
        ]);
        expectBoundedMatching(patterns, inputs);
    });

    test('fractional digits and whitespace do not have overlapping owners', () => {
        const inputs = [128, 512, 2048, 8192].flatMap((count) => [
            `text/markdown;q=0.${'1'.repeat(count)}x`,
            `text/markdown;foo=${'a'.repeat(count)}`,
            `text/markdown;foo="${'a '.repeat(count)}"`,
            `text/html;q=0.9${' '.repeat(count)}x, text/markdown;q=0.5`,
            `text/html;${' '.repeat(count)}x=1;q=0, text/markdown;q=0.5`
        ]);
        expectBoundedMatching(patterns, inputs);
    });

    test('repeated fractional and comma-separated ranges stay bounded', () => {
        const inputs = [8, 32, 128, 512].flatMap((count) => [
            `text/html${';q=0.5'.repeat(count)}x, text/markdown;q=0.9`,
            `${'text/html;q=0.5,'.repeat(count)}text/markdown;q=0.9`,
            `${'text/markdown;q=0.9,'.repeat(count)}text/html;q=0.5`,
            `${' ,'.repeat(count)}text/markdown;q=0`
        ]);
        expectBoundedMatching(patterns, inputs);
    });

    test('a failed comparison does not retry each qualifying duplicate quality', () => {
        const inputs = [128, 512, 1024, 2048, 4096].flatMap((count) => [
            `text/html${';q=0.9'.repeat(count)},text/markdown;q=0.95`,
            `text/markdown;q=0.95,text/html${';q=0.9'.repeat(count)}`,
            `${'text/html;q=0.9,'.repeat(count)}text/markdown;q=0.95`
        ]);
        expectBoundedMatching(patterns, inputs);
    });

    test('a long nonmatching slash suffix does not rescan every partition', () => {
        const redirect = addAgentRoutes({ version: 3 }, { pages: ['/'], markdownFiles: ['index.md'] }).routes?.[0];
        expect(redirect?.status).toBe(301);
        expectBoundedMatching(
            [['trailing-slash redirect', redirect!.src!]],
            [1024, 4096, 16384, 32768].flatMap((count) => [`/a${'/'.repeat(count)}x`, `/a${'/'.repeat(count)}`])
        );
    });
});
