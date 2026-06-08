import type { TransitionConfig } from 'svelte/transition';
import type { CollapseTransitionParams, CollapseTransitionStylePropName } from './types.js';

export function collapseIn(node: HTMLElement, params: CollapseTransitionParams): TransitionConfig {
    const isHorizontal = params.isHorizontal;
    // Choose dimension to animate: width for horizontal, height for vertical
    const stylePropName: CollapseTransitionStylePropName = isHorizontal ? 'width' : 'height';
    // Bootstrap collapse semantics: start with "collapsing" state, remove "collapse" and "show"
    node.classList.add('collapsing');
    node.classList.remove('collapse', 'show');
    node.style[stylePropName] = '0';
    const duration = getTransitionDuration(node);

    return {
        duration,
        css: (_progress: number, _remaining: number) => 'overflow: hidden;',
        // Svelte calls tick with progress from 0 to 1 during the transition
        tick: (progress: number, _remaining: number) => {
            if (progress < 1) {
                // Mid-transition: set dimension to full scroll size to trigger CSS transition
                if (isHorizontal) {
                    node.style.width = `${node.scrollWidth}px`;
                } else {
                    node.style.height = `${node.scrollHeight}px`;
                }
            } else {
                // Completion: remove "collapsing", add "collapse" and "show", clear inline styles
                node.classList.remove('collapsing');
                node.classList.add('collapse', 'show');
                node.style[stylePropName] = '';
            }
        }
    };
}

export function collapseOut(node: HTMLElement, params: CollapseTransitionParams): TransitionConfig {
    // Choose dimension to animate: width for horizontal, height for vertical
    const dimension: CollapseTransitionStylePropName = params.isHorizontal ? 'width' : 'height';
    // Set initial dimension to current size, then transition to 0
    node.style[dimension] = `${node.getBoundingClientRect()[dimension]}px`;
    // Bootstrap collapse semantics: start with "collapsing" state, remove "collapse" and "show"
    node.classList.add('collapsing');
    node.classList.remove('collapse', 'show');
    const duration = getTransitionDuration(node);

    return {
        duration,
        css: (_progress: number, _remaining: number) => 'overflow: hidden;',
        // Svelte calls tick with progress from 1 to 0 during the out transition
        tick: (progress: number, _remaining: number) => {
            if (progress > 0) {
                // Mid-transition: clear dimension to allow CSS transition to 0
                node.style[dimension] = '';
            } else if (progress === 0) {
                // Completion: remove "collapsing", add "collapse" (but not "show")
                node.classList.remove('collapsing');
                node.classList.add('collapse');
            }
        }
    };
}

export function getTransitionDuration(element: HTMLElement | null | undefined): number {
    if (!element) return 0;

    // Read CSS transition-duration and transition-delay from computed styles
    let { transitionDuration, transitionDelay } = window.getComputedStyle(element);

    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    // Return 0 if no transition is configured
    if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
    }

    // If multiple durations are defined (comma-separated), take the first one
    transitionDuration = transitionDuration.split(',')[0]!;
    transitionDelay = transitionDelay.split(',')[0]!;

    // Return total duration in milliseconds (duration + delay)
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * 1000;
}
