import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { prepareUnionComponentTypes } from '../prepare-union-component-types.mjs';
import { svelteMinimum } from '../svelte-minimum.mjs';

const workflow = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');

test('the minimum parser returns the exact approved caret floor', () => {
    assert.equal(svelteMinimum('^5.55.7'), '5.55.7');
});

test('unsupported range formats fail before dependency installation', () => {
    for (const range of [undefined, '', '5.55.7', '>=5.55.7 <6', '^5.55.7 || ^6', '^6.0.0', '^5.55.7-beta.1', '^5.055.7', '^5.55.07']) {
        assert.throws(() => svelteMinimum(range), /stable Svelte 5 caret/);
    }
});

test('the required build check fails closed for either failed, skipped or cancelled validation job', () => {
    const gate = workflow.match(/^    build:\n([\s\S]*?)(?=^    [\w-]+:|$(?![\s\S]))/m)?.[1];
    assert.ok(gate, 'required build job must exist');
    assert.match(gate, /needs: \[development, svelte-minimum\]/);
    assert.match(gate, /if: \$\{\{ always\(\) \}\}/);
    const script = gate.match(/run: \|\n((?: {18}[^\n]*(?:\n|$))+)/)?.[1].replace(/^ {18}/gm, '');
    assert.ok(script, 'required build job must evaluate both results');
    for (const development of ['success', 'failure', 'cancelled', 'skipped']) {
        for (const minimum of ['success', 'failure', 'cancelled', 'skipped']) {
            const result = spawnSync('bash', ['-e', '-c', script], {
                env: { ...process.env, DEVELOPMENT_RESULT: development, MINIMUM_RESULT: minimum }
            });
            assert.equal(result.status === 0, development === 'success' && minimum === 'success', `${development}/${minimum}`);
        }
    }
});

// These literal inputs are independent of the transform's expected-emission map.
const declarations = {
    'Button/button.svelte.d.ts': ['Button', 'ButtonRootProps', '"value" | "elementRef"'],
    'Dropdown/dropdown-toggle.svelte.d.ts': ['DropdownToggle', 'Dropdown.ToggleProps', '"elementRef"'],
    'Form/form-check-label.svelte.d.ts': ['FormCheckLabel', 'Form.CheckLabelProps', '"elementRef"'],
    'Form/form-input-group-text.svelte.d.ts': ['FormInputGroupText', 'Form.InputGroupTextProps', '"elementRef"'],
    'ListGroup/list-group.svelte.d.ts': ['ListGroup', 'ListGroupTypes.RootProps', '"elementRef"']
};
const originalDeclaration = ([name, props, bindings]) =>
    `// preserved documentation\ndeclare const ${name}: import("svelte").Component<${props}, {}, ${bindings}>;\ntype ${name} = ReturnType<typeof ${name}>;\nexport default ${name};\n`;
function declarationFixture(t) {
    const directory = mkdtempSync(join(tmpdir(), 'bootstrap-svelte-declarations-'));
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    for (const [path, signature] of Object.entries(declarations)) {
        mkdirSync(dirname(join(directory, path)), { recursive: true });
        writeFileSync(join(directory, path), originalDeclaration(signature));
    }
    mkdirSync(join(directory, 'common'), { recursive: true });
    writeFileSync(join(directory, 'common/union-component.d.ts'), 'export type ComponentWithUnionProps<Props, Bindings extends string> = never;');
    return directory;
}

test('prepares only five known union declarations while preserving props, bindings and the remaining file', (t) => {
    const directory = declarationFixture(t);
    writeFileSync(join(directory, 'untouched.d.ts'), 'export type Unrelated = string;');
    assert.equal(prepareUnionComponentTypes(directory), 5);
    for (const [path, [name, props, bindings]] of Object.entries(declarations)) {
        const expected = originalDeclaration([name, props, bindings]).replace(
            `import("svelte").Component<${props}, {}, ${bindings}>`,
            `import("../common/union-component.js").ComponentWithUnionProps<${props}, ${bindings}>`
        );
        assert.equal(readFileSync(join(directory, path), 'utf8'), expected);
    }
    assert.equal(readFileSync(join(directory, 'untouched.d.ts'), 'utf8'), 'export type Unrelated = string;');
    assert.throws(() => prepareUnionComponentTypes(directory), /Unexpected component declaration/);
});

test('rejects missing declarations or the private helper before writing any files', (t) => {
    for (const removed of ['ListGroup/list-group.svelte.d.ts', 'common/union-component.d.ts']) {
        const directory = declarationFixture(t);
        unlinkSync(join(directory, removed));
        assert.throws(() => prepareUnionComponentTypes(directory));
        assert.equal(
            readFileSync(join(directory, 'Button/button.svelte.d.ts'), 'utf8'),
            originalDeclaration(declarations['Button/button.svelte.d.ts'])
        );
    }
});

test('rejects unexpected names, changed or missing props, binding metadata, exports and instance aliases atomically', (t) => {
    for (const mutate of [
        (source) => source.replace('declare const ListGroup:', 'declare const Other:'),
        (source) => source.replace('ListGroupTypes.RootProps', 'Record<string, never>'),
        (source) => source.replace('Component<ListGroupTypes.RootProps, {}, "elementRef">', 'Component<{}, {}, "elementRef">'),
        (source) => source.replace('"elementRef"', '"class"'),
        (source) => source.replace('"elementRef"', '""'),
        (source) => source.replace('{}, "elementRef"', '{ changed: boolean }, "elementRef"'),
        (source) => source.replace('type ListGroup = ReturnType<typeof ListGroup>;', '')
    ]) {
        const directory = declarationFixture(t);
        const path = join(directory, 'ListGroup/list-group.svelte.d.ts');
        writeFileSync(path, mutate(readFileSync(path, 'utf8')));
        assert.throws(() => prepareUnionComponentTypes(directory), /Unexpected component declaration/);
        assert.equal(
            readFileSync(join(directory, 'Button/button.svelte.d.ts'), 'utf8'),
            originalDeclaration(declarations['Button/button.svelte.d.ts'])
        );
    }
});
