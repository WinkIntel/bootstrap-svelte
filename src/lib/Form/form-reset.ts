type ResetState = Pick<HTMLInputElement, 'checked' | 'value'>;
type ResetJob = () => (() => void) | undefined;
const pendingResets = new WeakMap<Event, Set<ResetJob>>();

function afterNativeReset(event: Event, job: ResetJob) {
    let jobs = pendingResets.get(event);
    if (!jobs) {
        jobs = new Set();
        pendingResets.set(event, jobs);
        const queued = jobs;
        setTimeout(() => {
            pendingResets.delete(event);
            // Read every input before publishing any binding updates. Sibling
            // group effects must not overwrite another control's native default
            // before its reset state has been captured.
            const commits = Array.from(queued, (prepare) => prepare());
            for (const commit of commits) commit?.();
        }, 0);
    }
    jobs.add(job);
}

/** Synchronize custom bindings after all reset listeners and the native action. */
export function syncFormReset(input: HTMLInputElement, sync: (state: ResetState) => void) {
    // ownerDocument covers a detached mount attached later and external form=.
    // The initial root also covers local detached/shadow forms. Moving a mounted
    // control into a different document or shadow root requires remounting it.
    const targets = new Set([input.ownerDocument, input.getRootNode()]);
    const seen = new WeakSet<Event>();
    let active = true;
    const handleReset = (event: Event) => {
        const form = input.form;
        if (!form || event.target !== form || seen.has(event)) return;
        seen.add(event);
        afterNativeReset(event, () => {
            if (!active || event.defaultPrevented || input.form !== form) return;
            const state = { checked: input.checked, value: input.value };
            return () => {
                if (active && input.form === form) sync(state);
            };
        });
    };
    for (const target of targets) target.addEventListener('reset', handleReset, true);
    return {
        destroy() {
            active = false;
            for (const target of targets) target.removeEventListener('reset', handleReset, true);
        }
    };
}
