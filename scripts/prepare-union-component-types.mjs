import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Only these reproduced union-prop declarations need deferred binding metadata.
// Fail on emitter/props/binding changes rather than guessing at a new signature.
const declarations = [
    ['Button/button.svelte.d.ts', 'Button', 'ButtonRootProps', '"value" | "elementRef"'],
    ['Dropdown/dropdown-toggle.svelte.d.ts', 'DropdownToggle', 'Dropdown.ToggleProps', '"elementRef"'],
    ['Form/form-check-label.svelte.d.ts', 'FormCheckLabel', 'Form.CheckLabelProps', '"elementRef"'],
    ['Form/form-input-group-text.svelte.d.ts', 'FormInputGroupText', 'Form.InputGroupTextProps', '"elementRef"'],
    ['ListGroup/list-group.svelte.d.ts', 'ListGroup', 'ListGroupTypes.RootProps', '"elementRef"']
];

export function prepareUnionComponentTypes(directory) {
    const helper = readFileSync(join(directory, 'common/union-component.d.ts'), 'utf8');
    assert.match(helper, /export type ComponentWithUnionProps<Props, Bindings extends string>/, 'Missing private union component helper');
    const changes = declarations.map(([file, name, props, bindings]) => {
        const path = join(directory, file);
        const source = readFileSync(path, 'utf8');
        const signature = `declare const ${name}: import("svelte").Component<${props}, {}, ${bindings}>;`;
        const instance = `type ${name} = ReturnType<typeof ${name}>;`;
        assert.equal(source.split(signature).length, 2, `Unexpected component declaration: ${file}`);
        assert.equal(source.split(instance).length, 2, `Unexpected component declaration: ${file}`);
        assert.equal(source.split(`export default ${name};`).length, 2, `Unexpected component declaration: ${file}`);
        const replacement = `declare const ${name}: import("../common/union-component.js").ComponentWithUnionProps<${props}, ${bindings}>;`;
        return { path, source: source.replace(signature, replacement) };
    });
    // Validate the entire known set before writing, so unexpected emission leaves
    // the generated package unchanged and prepack fails closed.
    for (const { path, source } of changes) writeFileSync(path, source);
    return changes.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    console.log(`Prepared ${prepareUnionComponentTypes(join(root, 'dist'))} union component declarations`);
}
