import { onMount, tick } from 'svelte';
import type { TransitionConfig } from 'svelte/transition';

/** Complete the first visible lifecycle when Svelte skips a local initial intro.
 * Native intros keep their timing; subsequent opens are handled only by their events.
 * Internal helper: deliberately not exported from the package entry point.
 */
export function initialShow<Params>(
    isShown: () => boolean,
    element: () => HTMLElement | null,
    transition: (element: Element, params: Params) => TransitionConfig
) {
    let transitionScheduled = false;
    onMount(() => {
        if (!isShown()) return;
        let mounted = true;
        void (async () => {
            // Let refs, portals and native transition scheduling settle before falling back.
            await tick();
            const target = element();
            if (!mounted || !isShown() || !target || transitionScheduled) return;
            target.dispatchEvent(new CustomEvent('introstart'));
            // Flush state changes made by onShow before reporting the component as shown.
            await tick();
            if (mounted && !transitionScheduled && isShown() && element() === target) target.dispatchEvent(new CustomEvent('introend'));
        })();
        return () => {
            mounted = false;
        };
    });
    return (target: Element, params: Params) => {
        // Transition functions run when Svelte schedules an intro/outro, before
        // introstart (which can wait for an animation frame or delay).
        transitionScheduled = true;
        return transition(target, params);
    };
}
