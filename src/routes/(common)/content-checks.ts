import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from './site.js';

export type CheckedInstallFile = {
    path: string;
    hasCanonicalInstallCommand: boolean;
    hasStaleInstallCommand: boolean;
    hasSveltePeerRange: boolean;
};

export type CheckedPublicApiFile = {
    path: string;
    stalePublicApiExamples: string[];
};

export type InstallDriftReport = {
    canonicalInstallCommand: string;
    sveltePeerRange: string;
    checkedFiles: CheckedInstallFile[];
    checkedPublicApiFiles: CheckedPublicApiFile[];
    errors: string[];
};

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

async function readOptional(rootUrl: URL, path: string): Promise<string | undefined> {
    try {
        return await readFile(join(rootUrl.pathname, path), 'utf8');
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
        throw error;
    }
}

function stalePublicApiExamples(content: string): string[] {
    return stalePublicApiPatterns.filter(({ pattern }) => pattern.test(content)).map(({ label }) => label);
}

export async function buildInstallDriftReport(rootUrl: URL): Promise<InstallDriftReport> {
    const packageJson = JSON.parse((await readFile(join(rootUrl.pathname, 'package.json'), 'utf8')) as string) as {
        peerDependencies?: Record<string, string>;
    };
    const sveltePeerRange = packageJson.peerDependencies?.svelte ?? '';
    const errors: string[] = [];
    const checkedFiles: CheckedInstallFile[] = [];
    const checkedPublicApiFiles: CheckedPublicApiFile[] = [];

    if (sveltePeerRange !== site.sveltePeerRange) {
        errors.push(`package.json peer dependency is ${sveltePeerRange || 'missing'}, expected ${site.sveltePeerRange}`);
    }

    for (const path of checkedPaths) {
        const content = await readOptional(rootUrl, path);
        if (content === undefined) {
            if (path.includes('/guides/')) errors.push(`${path} is missing`);
            continue;
        }

        const checkedFile = {
            path,
            hasCanonicalInstallCommand: content.includes(site.installCommand),
            hasStaleInstallCommand: staleInstallPattern.test(content),
            hasSveltePeerRange: content.includes(site.sveltePeerRange)
        };
        staleInstallPattern.lastIndex = 0;
        checkedFiles.push(checkedFile);

        if (path !== 'package.json' && !checkedFile.hasCanonicalInstallCommand) {
            errors.push(`${path} does not contain ${site.installCommand}`);
        }
        if (checkedFile.hasStaleInstallCommand) {
            errors.push(`${path} contains a stale install command or Svelte install command`);
        }
        if (!checkedFile.hasSveltePeerRange) {
            errors.push(`${path} does not document Svelte ${site.sveltePeerRange}`);
        }
    }

    for (const path of checkedPublicApiPaths) {
        const content = await readOptional(rootUrl, path);
        if (content === undefined) {
            errors.push(`${path} is missing`);
            continue;
        }

        const stalePublicApiExamplesForFile = stalePublicApiExamples(content);
        checkedPublicApiFiles.push({ path, stalePublicApiExamples: stalePublicApiExamplesForFile });

        for (const stalePublicApiExample of stalePublicApiExamplesForFile) {
            errors.push(`${path} contains ${stalePublicApiExample}`);
        }
    }

    return {
        canonicalInstallCommand: site.installCommand,
        sveltePeerRange: site.sveltePeerRange,
        checkedFiles,
        checkedPublicApiFiles,
        errors
    };
}
