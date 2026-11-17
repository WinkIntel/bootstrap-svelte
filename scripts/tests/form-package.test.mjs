import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { test } from 'node:test';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { prepareUnionComponentTypes } from '../prepare-union-component-types.mjs';

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
        (source) => source.replace('type ListGroup = ReturnType<typeof ListGroup>;', ''),
        (source) => source.replace('export default ListGroup;', 'export default Other;'),
        (source) => source.replace('export default ListGroup;', 'export default ListGroup;\nexport default ListGroup;')
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
