import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Test the packed library with its declared minimum, independently of workspace resolution.
const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const minimum = /^\^(5\.\d+\.\d+)$/.exec(pkg.peerDependencies.svelte)?.[1];
assert.ok(minimum, 'Expected a stable Svelte 5 caret peer requirement');
const directory = mkdtempSync(join(tmpdir(), 'bootstrap-svelte-consumer-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (args, cwd = directory) => execFileSync(npm, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });

try {
    const [packed] = JSON.parse(run(['pack', '--ignore-scripts', '--json', '--pack-destination', directory], root));
    const tarball = join(directory, packed.filename);
    const manifest = JSON.parse(execFileSync('tar', ['-xOzf', tarball, 'package/package.json'], { encoding: 'utf8' }));
    assert.equal(manifest.peerDependencies.svelte, pkg.peerDependencies.svelte);
    assert.equal(manifest.version, pkg.version);
    assert.ok(packed.files.some(({ path }) => path === 'README.md'));
    assert.ok(packed.files.some(({ path }) => path === 'dist/index.d.ts'));
    writeFileSync(
        join(directory, 'package.json'),
        JSON.stringify({
            private: true,
            type: 'module',
            dependencies: { [pkg.name]: `file:${tarball}`, svelte: minimum },
            devDependencies: {
                '@sveltejs/vite-plugin-svelte': pkg.devDependencies['@sveltejs/vite-plugin-svelte'],
                vite: pkg.devDependencies.vite,
                'svelte-check': pkg.devDependencies['svelte-check'],
                typescript: pkg.devDependencies.typescript
            }
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
                skipLibCheck: true,
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
import { Alert, Badge, Button, Dropdown, Modal } from '${pkg.name}';
import type { ButtonRootProps, Modal as ModalTypes } from '${pkg.name}';
let shown = $state(false);
const button: ButtonRootProps = { colorVariant: 'primary' };
const modal: ModalTypes.RootProps = { isShown: false };
</script>
<Alert class="d-flex">Default alert</Alert>
<Badge colorVariant="none" class="badge-brand">Custom badge</Badge>
<Button {...button} onclick={() => (shown = true)}>Open</Button>
<Modal.Root {...modal} isShown={shown} onHide={() => (shown = false)}><Modal.Dialog><Modal.Content><Modal.Body>Body</Modal.Body></Modal.Content></Modal.Dialog></Modal.Root>
<Dropdown.Root><Dropdown.Toggle>Menu</Dropdown.Toggle><Dropdown.Menu offset={[0, 8]}><Dropdown.Item>Item</Dropdown.Item></Dropdown.Menu></Dropdown.Root>`
    );
    console.log(run(['install', '--ignore-scripts', '--strict-peer-deps', '--no-audit', '--no-fund']));
    const installed = JSON.parse(readFileSync(join(directory, 'node_modules/svelte/package.json'), 'utf8'));
    assert.equal(installed.version, minimum, 'Consumer must use the exact declared minimum');
    console.log(run(['exec', '--', 'svelte-check', '--tsconfig', './tsconfig.json']));
    console.log(run(['exec', '--', 'vite', 'build']));
    console.log(`Packed consumer passed: ${pkg.name}@${pkg.version}, Svelte ${minimum}`);
} finally {
    rmSync(directory, { recursive: true, force: true });
}
