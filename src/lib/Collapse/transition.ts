import type { TransitionConfig } from 'svelte/transition';
import type { CollapseTransitionParams, CollapseTransitionStylePropName } from './types.js';

const resolveTransitionDuration = (node: HTMLElement, transitionDuration: number | undefined): number =>
    transitionDuration !== undefined && Number.isFinite(transitionDuration) && transitionDuration >= 0
        ? transitionDuration
        : getTransitionDuration(node);

type InlineStyleSnapshot = {
    value: string;
    priority: string;
};

type TransitionTimingState = {
    duration: InlineStyleSnapshot;
    delay: InlineStyleSnapshot;
    owner: object;
};

const transitionTimingStates = new WeakMap<HTMLElement, TransitionTimingState>();

const applyTransitionTiming = (node: HTMLElement, duration: number): (() => void) => {
    const owner = {};
    let state = transitionTimingStates.get(node);

    if (!state) {
        state = {
            duration: {
                value: node.style.getPropertyValue('transition-duration'),
                priority: node.style.getPropertyPriority('transition-duration')
            },
            delay: {
                value: node.style.getPropertyValue('transition-delay'),
                priority: node.style.getPropertyPriority('transition-delay')
            },
            owner
        };
        transitionTimingStates.set(node, state);
    } else {
        state.owner = owner;
    }

    node.style.setProperty('transition-duration', `${duration}ms`);
    node.style.setProperty('transition-delay', '0ms');

    return () => {
        if (transitionTimingStates.get(node)?.owner !== owner) return;
        transitionTimingStates.delete(node);

        if (state.duration.value) {
            node.style.setProperty('transition-duration', state.duration.value, state.duration.priority);
        } else {
            node.style.removeProperty('transition-duration');
        }

        if (state.delay.value) {
            node.style.setProperty('transition-delay', state.delay.value, state.delay.priority);
        } else {
            node.style.removeProperty('transition-delay');
        }
    };
};

export function collapseIn(node: HTMLElement, params: CollapseTransitionParams): TransitionConfig {
    const isHorizontal = params.isHorizontal;
    // Choose dimension to animate: width for horizontal, height for vertical
    const stylePropName: CollapseTransitionStylePropName = isHorizontal ? 'width' : 'height';
    // Bootstrap collapse semantics: start with "collapsing" state, remove "collapse" and "show"
    node.classList.add('collapsing');
    node.classList.remove('collapse', 'show');
    node.style[stylePropName] = '0';
    const duration = resolveTransitionDuration(node, params.transitionDuration);
    const restoreTransitionTiming = applyTransitionTiming(node, duration);

    // Svelte skips transition ticks when duration is zero, so complete the
    // Bootstrap class state ourselves for explicit no-animation transitions.
    if (duration === 0) {
        node.classList.remove('collapsing');
        node.classList.add('collapse', 'show');
        node.style[stylePropName] = '';
        restoreTransitionTiming();
    }

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
                restoreTransitionTiming();
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
    const duration = resolveTransitionDuration(node, params.transitionDuration);
    const restoreTransitionTiming = applyTransitionTiming(node, duration);

    // See collapseIn: a zero-duration transition does not receive a final tick.
    if (duration === 0) {
        node.classList.remove('collapsing');
        node.classList.add('collapse');
        node.style[dimension] = '';
        restoreTransitionTiming();
    }

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
                restoreTransitionTiming();
            }
        }
    };
}

export function getTransitionDuration(element: HTMLElement | null | undefined): number {
    if (!element) return 0;

    const { transitionDuration, transitionDelay } = window.getComputedStyle(element);
    const parseTime = (value: string, allowNegative: boolean): number => {
        const firstValue = value.split(',')[0]?.trim() ?? '';
        const match = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(ms|s)$/i.exec(firstValue);
        if (!match) return 0;

        const amount = Number(match[1]);
        if (!Number.isFinite(amount) || (!allowNegative && amount < 0)) return 0;
        return match[2]?.toLowerCase() === 'ms' ? amount : amount * 1000;
    };

    const duration = parseTime(transitionDuration, false);
    const delay = parseTime(transitionDelay, true);
    return Math.max(0, duration + delay);
}
