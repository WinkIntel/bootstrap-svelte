/** Synchronize custom input bindings after the form's cancelable native reset. */
export function syncFormReset(input: HTMLInputElement, sync: () => void) {
    // Capture at the root so changes to `form=`, form ids, or DOM placement keep
    // using the input's actual association rather than a form captured at mount.
    const root = input.getRootNode();
    let active = true;
    const handleReset = (event: Event) => {
        if (event.target !== input.form) return;
        queueMicrotask(() => {
            // Reset listeners run before the native default action and may cancel
            // it. Unmount can also happen before this deferred work executes.
            if (active && !event.defaultPrevented && event.target === input.form) sync();
        });
    };
    root.addEventListener('reset', handleReset, true);
    return {
        destroy() {
            active = false;
            root.removeEventListener('reset', handleReset, true);
        }
    };
}
