import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const canonicalInstallCommand = 'pnpm add @winkintel/bootstrap-svelte bootstrap';
const sveltePeerRange = '^5.29.0';
const checkedPaths = [
    'package.json',
    'README.md',
    'AGENTS.md',
    'src/routes/+page.svelte',
    'src/routes/guides/sveltekit-bootstrap-5/+page.svelte',
    'src/routes/(common)/agent-docs.ts',
    'CLAUDE.md'
];
const checkedPublicApiPaths = [
    'README.md',
    'AGENTS.md',
    'src/routes/(common)/agent-docs.ts',
    'src/routes/guides/sveltekit-bootstrap-5/+page.svelte',
    'src/lib/Modal/modal.svelte',
    'src/lib/Offcanvas/offcanvas.svelte',
    'src/lib/Form/form-input-label.svelte',
    'src/lib/Form/form-helper-text.svelte',
    'src/lib/Form/form-range-input.svelte'
];
const staleInstallPattern =
    /pnpm add @winkintel\/bootstrap-svelte(?! bootstrap)|svelte@~5\.0\.0|svelte@\^5\.29\.0|svelte@\^5\.29(?!\.0\b)|svelte\s+\^5\.29(?!\.0\b)/gi;
const stalePublicApiPatterns = [
    { label: 'nonexistent <Form.Group>', pattern: /<\/?Form\.Group(?=[\s>])/ },
    { label: 'bare <Card> compound root', pattern: /<\/?Card(?=[\s>])/ },
    { label: 'bare <Modal> compound root', pattern: /<\/?Modal(?=[\s>])/ },
    { label: 'bare <Offcanvas> compound root', pattern: /<\/?Offcanvas(?=[\s>])/ },
    { label: 'stale Offcanvas isVisible prop', pattern: /<(?:Offcanvas(?!\.)|Offcanvas\.Root)\b[^>]*(?<![\w:-])isVisible\s*=/ },
    {
        label: 'stale Offcanvas bodyScrolling prop',
        pattern: /<(?:Offcanvas(?!\.)|Offcanvas\.Root)\b[^>]*(?<![\w:-])bodyScrolling\s*=/
    },
    { label: 'stale Offcanvas isStatic prop', pattern: /<(?:Offcanvas(?!\.)|Offcanvas\.Root)\b[^>]*(?<![\w:-])isStatic\s*=/ },
    { label: 'stale Offcanvas breakpoint prop', pattern: /<(?:Offcanvas(?!\.)|Offcanvas\.Root)\b[^>]*(?<![\w:-])breakpoint\s*=/ },
    { label: 'stale ButtonProps public type', pattern: /(?<![\w.])ButtonProps(?!\w)/ },
    { label: 'stale ModalProps public type', pattern: /(?<![\w.])ModalProps(?!\w)/ }
];
const errors = [];

async function readOptional(path) {
    try {
        return await readFile(join(root, path), 'utf8');
    } catch (error) {
        if (error?.code === 'ENOENT') return undefined;
        throw error;
    }
}

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
if (packageJson.peerDependencies?.svelte !== sveltePeerRange) {
    errors.push(`package.json peer dependency is ${packageJson.peerDependencies?.svelte ?? 'missing'}, expected ${sveltePeerRange}`);
}

for (const path of checkedPaths) {
    const content = await readOptional(path);
    if (content === undefined) {
        errors.push(`${path} is missing`);
        continue;
    }

    const hasCanonicalInstallCommand = content.includes(canonicalInstallCommand);
    const hasStaleInstallCommand = staleInstallPattern.test(content);
    staleInstallPattern.lastIndex = 0;

    if (path !== 'package.json' && !hasCanonicalInstallCommand) errors.push(`${path} does not contain ${canonicalInstallCommand}`);
    if (hasStaleInstallCommand) errors.push(`${path} contains a stale install command or Svelte install command`);
    if (!content.includes(sveltePeerRange)) errors.push(`${path} does not document Svelte ${sveltePeerRange}`);
}

for (const path of checkedPublicApiPaths) {
    const content = await readOptional(path);
    if (content === undefined) {
        errors.push(`${path} is missing`);
        continue;
    }

    for (const { label, pattern } of stalePublicApiPatterns) {
        if (pattern.test(content)) errors.push(`${path} contains ${label}`);
    }
}

if (errors.length > 0) {
    console.error(['Install content drift detected:', ...errors.map((error) => `- ${error}`)].join('\n'));
    process.exit(1);
}

console.log(`Install content matches ${canonicalInstallCommand}, Svelte ${sveltePeerRange}, and current public API examples.`);
