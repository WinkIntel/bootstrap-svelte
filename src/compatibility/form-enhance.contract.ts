import { enhance } from '$app/forms';
import type { Action } from 'svelte/action';
import type { Form } from '$lib/index.js';

// This app-side contract checks the real Kit export without shipping Kit types
// in the framework-independent library package.
const kitAction: Form.RootProps['enhance'] = enhance;
const customAction: Form.RootProps['enhance'] = (form: HTMLFormElement, options?: { validate: boolean }) => ({
    update(next?: { validate: boolean }) {
        void next;
        void options;
        void form;
    },
    destroy() {}
});
const svelteAction: Action<HTMLFormElement, { validate: boolean } | undefined> = customAction;
const compatibleAction: Form.RootProps['enhance'] = svelteAction;
const voidAction: Form.RootProps['enhance'] = (form: HTMLFormElement) => {
    void form;
};

void kitAction;
void compatibleAction;
void voidAction;
