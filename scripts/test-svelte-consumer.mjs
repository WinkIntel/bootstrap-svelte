import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svelteMinimum } from './svelte-minimum.mjs';

// Test the packed library with its declared minimum, independently of workspace resolution.
const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const minimum = svelteMinimum(pkg.peerDependencies.svelte);
assert.notEqual(process.platform, 'win32', 'This repository check requires POSIX npm and tar; use WSL on Windows');
const toolchain = Object.fromEntries(
    ['@sveltejs/vite-plugin-svelte', 'vite', 'svelte-check', 'typescript', '@types/node'].map((name) => {
        const installed = JSON.parse(readFileSync(join(root, 'node_modules', name, 'package.json'), 'utf8'));
        assert.match(installed.version, /^\d+\.\d+\.\d+$/, `Expected an installed stable version for ${name}`);
        return [name, installed.version];
    })
);
const directory = mkdtempSync(join(tmpdir(), 'bootstrap-svelte-consumer-'));
const run = (args, cwd = directory, capture = false) =>
    execFileSync('npm', args, { cwd, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit' });

try {
    // Refresh package output even when called directly after editing source.
    run(['run', 'prepack'], root);
    const [packed] = JSON.parse(run(['pack', '--ignore-scripts', '--json', '--pack-destination', directory], root, true));
    const tarball = join(directory, packed.filename);
    const manifest = JSON.parse(execFileSync('tar', ['-xOzf', tarball, 'package/package.json'], { encoding: 'utf8' }));
    assert.equal(manifest.peerDependencies.svelte, pkg.peerDependencies.svelte);
    assert.equal(manifest.version, pkg.version);
    assert.deepEqual(manifest.exports, pkg.exports);
    assert.ok(packed.files.some(({ path }) => path === 'README.md'));
    assert.ok(packed.files.some(({ path }) => path === 'dist/index.d.ts'));
    writeFileSync(
        join(directory, 'package.json'),
        JSON.stringify({
            private: true,
            type: 'module',
            dependencies: { [pkg.name]: `file:${tarball}`, svelte: minimum },
            devDependencies: toolchain
        })
    );
    mkdirSync(join(directory, 'src'));
    writeFileSync(join(directory, 'index.html'), '<div id="app"></div><script type="module" src="/src/main.js"></script>');
    writeFileSync(
        join(directory, 'vite.config.js'),
        "import { defineConfig } from 'vite'; import { svelte } from '@sveltejs/vite-plugin-svelte'; export default defineConfig({ plugins: [svelte()] });"
    );
    writeFileSync(
        join(directory, 'tsconfig.json'),
        JSON.stringify({
            compilerOptions: {
                target: 'ES2022',
                module: 'ESNext',
                moduleResolution: 'Bundler',
                strict: true,
                skipLibCheck: false,
                allowJs: true,
                noEmit: true
            },
            include: ['src/**/*']
        })
    );
    writeFileSync(
        join(directory, 'src/main.js'),
        "import { mount } from 'svelte'; import App from './App.svelte'; mount(App, { target: document.getElementById('app') });"
    );
    writeFileSync(
        join(directory, 'src/App.svelte'),
        `<script lang="ts">
import { Alert, Badge, Button, ButtonCheck, Dropdown, Form, ListGroup, Modal, Pagination } from '${pkg.name}';
import type { ButtonRootProps, Modal as ModalTypes } from '${pkg.name}';
let shown = $state(false);
let group = $state<string | undefined>(undefined);
let values = $state<unknown[]>([]);
let color = $state('#563d7c');
let files = $state<FileList | null>(null);
let element = $state<HTMLElement | null>(null);
let buttonValue = $state('Go');
const form: Form.RootProps = { enhance: (node: HTMLFormElement) => ({ destroy() { void node; } }) };
const button: ButtonRootProps = { colorVariant: 'primary' };
const modal: ModalTypes.RootProps = { isShown: false };
</script>
<Form.Root {...form}>
    <Form.CheckInput bind:group={values} value="check" indeterminate />
    <Form.SwitchInput bind:group={values} value="switch" isIndeterminate={false} />
    <Form.ColorInput name="color" bind:value={color} />
    <Form.FileInput name="file" bind:files />
    <Form.CheckLabel for="check" elementType="label" bind:elementRef={element}>Check</Form.CheckLabel>
    <Form.InputGroupText for="check" elementType="label" bind:elementRef={element}>Label</Form.InputGroupText>
    <Form.DateInput autocomplete="on" />
    <Form.TextArea isResizable={false} />
    <ButtonCheck type="radio" name="options" value="a" bind:group>A</ButtonCheck>
    <ButtonCheck type="radio" name="options" value="b" bind:group>B</ButtonCheck>
    <ButtonCheck type="radio" checked>Standalone</ButtonCheck>
</Form.Root>
<Pagination.Root>
    <Pagination.Item isControl><Pagination.Link href="#previous">Previous</Pagination.Link></Pagination.Item>
    <Pagination.Item isActive><Pagination.Link href="#page">Page</Pagination.Link></Pagination.Item>
    <Pagination.Item isControl><Pagination.Link href="#next">Next</Pagination.Link></Pagination.Item>
</Pagination.Root>
<Alert class="d-flex">Default alert</Alert>
<Badge colorVariant="none" class="badge-brand">Custom badge</Badge>
<Button {...button} onclick={() => (shown = true)}>Open</Button>
<Button type="button" bind:value={buttonValue} bind:elementRef={element} />
<ListGroup.Root isNumbered horizontalOnBreakpoint="md" bind:elementRef={element}><ListGroup.Item>Item</ListGroup.Item></ListGroup.Root>
<Modal.Root {...modal} isShown={shown} onHide={() => (shown = false)}><Modal.Dialog><Modal.Content><Modal.Body>Body</Modal.Body></Modal.Content></Modal.Dialog></Modal.Root>
<Dropdown.Root><Dropdown.Toggle bind:elementRef={element}>Menu</Dropdown.Toggle><Dropdown.Menu offset={[0, 8]}><Dropdown.Item>Item</Dropdown.Item></Dropdown.Menu></Dropdown.Root>`
    );
    writeFileSync(
        join(directory, 'src/type-contracts.ts'),
        `
import { Button, Dropdown, Form, ListGroup } from '${pkg.name}';
import type { ButtonRootProps } from '${pkg.name}';
import type { Component, ComponentProps } from 'svelte';
// @ts-expect-error The declaration helper stays private to package generation.
import type { ComponentWithUnionProps } from '${pkg.name}';
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type Props = Assert<Equal<ComponentProps<typeof Button>, ButtonRootProps>>;
type Set = Assert<Equal<Parameters<NonNullable<ReturnType<typeof Button>['$set']>>[0], Partial<ButtonRootProps>>>;
type Static = Assert<Equal<Pick<typeof Button, 'element'>, Pick<Component, 'element'>>>;
type Bindings = Assert<Equal<[
    typeof Button['z_$$bindings'], typeof Dropdown.Toggle['z_$$bindings'], typeof Form.CheckLabel['z_$$bindings'],
    typeof Form.InputGroupText['z_$$bindings'], typeof ListGroup.Root['z_$$bindings']
], ['value' | 'elementRef' | undefined, 'elementRef' | undefined, 'elementRef' | undefined, 'elementRef' | undefined, 'elementRef' | undefined]>>;
const label: ComponentProps<typeof Form.CheckLabel> = { for: 'check', elementType: 'label' };
const list: ComponentProps<typeof ListGroup.Root> = { isNumbered: true, horizontalOnBreakpoint: 'md' };
// @ts-expect-error Preserve the existing discriminated href/value prop union.
const invalidButton: ComponentProps<typeof Button> = { href: '/', value: 'invalid' };
// @ts-expect-error Preserve specialized input type ownership.
const invalidDate: ComponentProps<typeof Form.DateInput> = { type: 'email' };
void label; void list; void invalidButton; void invalidDate;
export type { Props, Set, Static, Bindings };
`
    );
    console.log('Consumer direct toolchain:', JSON.stringify(toolchain));
    run(['install', '--ignore-scripts', '--strict-peer-deps', '--no-audit', '--no-fund']);
    const installed = JSON.parse(readFileSync(join(directory, 'node_modules/svelte/package.json'), 'utf8'));
    assert.equal(installed.version, minimum, 'Consumer must use the exact declared minimum');
    run(['exec', '--', 'svelte-check', '--tsconfig', './tsconfig.json']);
    writeFileSync(
        join(directory, 'src/InvalidBindings.svelte'),
        `<script lang="ts">
import { Button, Dropdown, Form, ListGroup } from '${pkg.name}';
let id = $state<string | null | undefined>('invalid');
</script>
<Button bind:id />
<Dropdown.Toggle bind:id />
<Form.CheckLabel bind:id />
<Form.InputGroupText bind:id />
<ListGroup.Root bind:id />`
    );
    const negative = spawnSync('npm', ['exec', '--', 'svelte-check', '--tsconfig', './tsconfig.json'], { cwd: directory, encoding: 'utf8' });
    const diagnostics = `${negative.stdout ?? ''}\n${negative.stderr ?? ''}`;
    assert.notEqual(negative.status, 0, 'Unbindable native props must remain rejected');
    assert.equal((diagnostics.match(/declared as non-bindable inside the component/g) ?? []).length, 5, diagnostics);
    rmSync(join(directory, 'src/InvalidBindings.svelte'));
    console.log('Packed consumer rejected all five invalid binding contracts');
    run(['exec', '--', 'vite', 'build']);
    console.log(`Packed consumer passed: ${pkg.name}@${pkg.version}, Svelte ${minimum}`);
} finally {
    rmSync(directory, { recursive: true, force: true });
}
