import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, test } from 'vitest';
import { buildInstallDriftReport } from './content-checks.js';
import { site } from './site.js';

const CHECKED_INSTALL_PATHS = [
    'package.json',
    'README.md',
    'AGENTS.md',
    'src/routes/+page.svelte',
    'src/routes/guides/sveltekit-bootstrap-5/+page.svelte',
    'src/routes/(common)/agent-docs.ts',
    'CLAUDE.md'
];

const CHECKED_PUBLIC_API_PATHS = [
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

async function writeFixtureFile(root: string, path: string, content: string): Promise<void> {
    const fullPath = join(root, path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content);
}

async function createInstallFixture(overrides: Record<string, string> = {}): Promise<URL> {
    const root = await mkdtemp(join(tmpdir(), 'bootstrap-svelte-install-content-'));
    for (const path of new Set([...CHECKED_INSTALL_PATHS, ...CHECKED_PUBLIC_API_PATHS])) {
        const content =
            path === 'package.json'
                ? JSON.stringify({ peerDependencies: { svelte: site.sveltePeerRange } })
                : `${site.installCommand}\nSvelte ${site.sveltePeerRange}\n<Card.Root></Card.Root>\n<Modal.Root isShown={showModal}></Modal.Root>\n<Offcanvas.Root isShown={showOffcanvas} isBodyScrollable={true} useBackdrop="static" showOnBreakpoint="lg"></Offcanvas.Root>\n\`ButtonRootProps\` \`Card.RootProps\` \`Modal.RootProps\`\n`;
        await writeFixtureFile(root, path, overrides[path] ?? content);
    }
    return pathToFileURL(root);
}

describe('install content checks', () => {
    test('canonical install command and Svelte peer dependency agree across source content', async () => {
        const report = await buildInstallDriftReport(new URL('../../..', import.meta.url));
        expect(report.canonicalInstallCommand).toBe('pnpm add @winkintel/bootstrap-svelte bootstrap');
        expect(report.sveltePeerRange).toBe('^5.29.0');
        expect(report.errors).toEqual([]);
        expect(report.checkedFiles.map((file) => file.path)).toEqual(CHECKED_INSTALL_PATHS);
        expect(report.checkedPublicApiFiles.map((file) => file.path)).toEqual(CHECKED_PUBLIC_API_PATHS);
        for (const checkedFile of report.checkedFiles) {
            expect(checkedFile.hasStaleInstallCommand, `${checkedFile.path} should not contain stale install guidance`).toBe(false);
            expect(checkedFile.hasSveltePeerRange, `${checkedFile.path} should document Svelte ${site.sveltePeerRange}`).toBe(true);
            if (checkedFile.path !== 'package.json') {
                expect(checkedFile.hasCanonicalInstallCommand, `${checkedFile.path} should document ${site.installCommand}`).toBe(true);
            }
        }
    });

    test('flags stale Svelte guidance in generated agent docs and repository agent instructions', async () => {
        const report = await buildInstallDriftReport(
            await createInstallFixture({
                'src/routes/(common)/agent-docs.ts': `${site.installCommand}\nSvelte 4 or earlier: the peer dependency is \`svelte ^5.29\`.`,
                'CLAUDE.md': `${site.installCommand}\n\`svelte@~5.0.0\` is a peer dependency.`
            })
        );

        expect(report.checkedFiles.map((file) => file.path)).toEqual(CHECKED_INSTALL_PATHS);
        expect(report.errors).toEqual(
            expect.arrayContaining([
                'src/routes/(common)/agent-docs.ts contains a stale install command or Svelte install command',
                'CLAUDE.md contains a stale install command or Svelte install command'
            ])
        );
    });

    test('flags stale public API examples without matching current Root APIs', async () => {
        const report = await buildInstallDriftReport(
            await createInstallFixture({
                'README.md': `${site.installCommand}\nSvelte ${site.sveltePeerRange}\n<Card>Card body</Card>\n<Modal isShown={showModal}></Modal>\n`,
                'AGENTS.md': `${site.installCommand}\nSvelte ${site.sveltePeerRange}\nimport type { ButtonProps, ModalProps } from '@winkintel/bootstrap-svelte';\n`,
                'src/lib/Modal/modal.svelte': '<Modal isShown={showModal}><Modal.Dialog /></Modal>',
                'src/lib/Offcanvas/offcanvas.svelte': [
                    '<Offcanvas placement="start" isVisible={true}></Offcanvas>',
                    '<Offcanvas.Root bodyScrolling={true}></Offcanvas.Root>',
                    '<Offcanvas.Root isStatic={true}></Offcanvas.Root>',
                    '<Offcanvas.Root breakpoint="lg"></Offcanvas.Root>'
                ].join('\n'),
                'src/lib/Form/form-input-label.svelte': '<Form.Group><Form.InputLabel>Email</Form.InputLabel></Form.Group>',
                'src/lib/Form/form-helper-text.svelte': '<Form.Group><Form.HelperText>Help</Form.HelperText></Form.Group>',
                'src/lib/Form/form-range-input.svelte': '<Form.Group><Form.RangeInput /></Form.Group>'
            })
        );

        expect(report.errors).toEqual(
            expect.arrayContaining([
                'README.md contains bare <Card> compound root',
                'README.md contains bare <Modal> compound root',
                'AGENTS.md contains stale ButtonProps public type',
                'AGENTS.md contains stale ModalProps public type',
                'src/lib/Modal/modal.svelte contains bare <Modal> compound root',
                'src/lib/Offcanvas/offcanvas.svelte contains bare <Offcanvas> compound root',
                'src/lib/Offcanvas/offcanvas.svelte contains stale Offcanvas isVisible prop',
                'src/lib/Offcanvas/offcanvas.svelte contains stale Offcanvas bodyScrolling prop',
                'src/lib/Offcanvas/offcanvas.svelte contains stale Offcanvas isStatic prop',
                'src/lib/Offcanvas/offcanvas.svelte contains stale Offcanvas breakpoint prop',
                'src/lib/Form/form-input-label.svelte contains nonexistent <Form.Group>',
                'src/lib/Form/form-helper-text.svelte contains nonexistent <Form.Group>',
                'src/lib/Form/form-range-input.svelte contains nonexistent <Form.Group>'
            ])
        );
        expect(report.errors).not.toEqual(
            expect.arrayContaining([
                'src/routes/(common)/agent-docs.ts contains stale ButtonProps public type',
                'src/routes/(common)/agent-docs.ts contains stale ModalProps public type'
            ])
        );
    });

    test('allows current Offcanvas root props and component member tags without false positives', async () => {
        const report = await buildInstallDriftReport(
            await createInstallFixture({
                'src/lib/Modal/modal.svelte': [
                    '<Modal.Root isShown={showModal} useBackdrop="static" isKeyboardDismissible={true}>',
                    '    <Modal.Dialog><Modal.Content><Modal.Title>Title</Modal.Title></Modal.Content></Modal.Dialog>',
                    '</Modal.Root>'
                ].join('\n'),
                'src/lib/Offcanvas/offcanvas.svelte': [
                    '<Offcanvas.Root placement="start" isShown={true} isBodyScrollable={true} useBackdrop="static" showOnBreakpoint="lg">',
                    '    <Offcanvas.Header><Offcanvas.Title>Title</Offcanvas.Title></Offcanvas.Header>',
                    '    <Offcanvas.Body>Body</Offcanvas.Body>',
                    '</Offcanvas.Root>',
                    '<Container breakpoint="lg" />'
                ].join('\n')
            })
        );

        expect(report.errors).not.toEqual(
            expect.arrayContaining([
                'src/lib/Modal/modal.svelte contains bare <Modal> compound root',
                'src/lib/Offcanvas/offcanvas.svelte contains bare <Offcanvas> compound root',
                'src/lib/Offcanvas/offcanvas.svelte contains stale Offcanvas isVisible prop',
                'src/lib/Offcanvas/offcanvas.svelte contains stale Offcanvas bodyScrolling prop',
                'src/lib/Offcanvas/offcanvas.svelte contains stale Offcanvas isStatic prop',
                'src/lib/Offcanvas/offcanvas.svelte contains stale Offcanvas breakpoint prop'
            ])
        );
    });

    test('site metadata exposes canonical package integration facts', () => {
        expect(site.packageName).toBe('@winkintel/bootstrap-svelte');
        expect(site.installCommand).toBe('pnpm add @winkintel/bootstrap-svelte bootstrap');
        expect(site.sveltePeerRange).toBe('^5.29.0');
        expect(site.bootstrapCssImport).toBe("import 'bootstrap/dist/css/bootstrap.min.css';");
    });
});
