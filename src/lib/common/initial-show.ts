import { onMount, tick } from 'svelte';
import type { TransitionConfig } from 'svelte/transition';

/** Complete the first visible lifecycle when Svelte skips a local initial intro.
 * Native intros keep their timing; subsequent opens are handled only by their events.
 * Internal helper: deliberately not exported from the package entry point.
 */
export function initialShow<Params>(
    isShown: () => boolean,
    element: () => HTMLElement | null,
    onShow: (event: Event) => void,
    onShown: (event: Event) => void,
    transition: (element: Element, params: Params) => TransitionConfig
) {
    let transitionScheduled = false;
    onMount(() => {
        const initiallyShown = isShown();
        let mounted = true;
        void (async () => {
            // Let refs, portals and native transition scheduling settle before falling back.
            await tick();
            const target = element();
            if (!mounted || !initiallyShown || !isShown() || !target || transitionScheduled) return;
            target.dispatchEvent(new CustomEvent('introstart'));
            // onShow may close/unmount the component. Flush prop-to-state synchronization
            // (Offcanvas synchronizes on the next tick) before reporting it as shown.
            await tick();
            await tick();
            if (mounted && !transitionScheduled && isShown() && element() === target) target.dispatchEvent(new CustomEvent('introend'));
        })();
        return () => {
            mounted = false;
        };
    });
    return {
        transition(target: Element, params: Params) {
            // Transition functions run when Svelte actually schedules an intro/outro,
            // before introstart (which can wait for an animation frame or delay).
            transitionScheduled = true;
            return transition(target, params);
        },
        start(event: Event) {
            onShow(event);
        },
        end(event: Event) {
            onShown(event);
        }
    };
}
