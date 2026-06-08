import { Context } from '$lib/common/index.js';
import type { ProgressProps, ProgressStackedProps } from './types.js';

/**
 * Manages state for a stacked progress component that can contain multiple
 * progress bars aligned horizontally in the same container
 */
export class ProgressStackedState {
    constructor(readonly props: ProgressStackedProps) {}
}

/**
 * Manages state for the progress components and it's child progress bar component,
 * which can be used standalone or as part of a stacked progress group
 */
export class ProgressState {
    // Reactive state to track whether this progress bar is part of a stacked group
    readonly isStacked: boolean = $state(false);
    constructor(
        readonly props: ProgressProps,
        readonly root: ProgressStackedState | null = null
    ) {
        this.isStacked = this.root !== null;
    }
}

// Context provides a way for child progress bars to discover if they're
// inside a stacked container without explicit prop passing
const ProgressStackedContext = new Context<ProgressStackedState>('progress-stacked');

/**
 * Initializes a stacked progress context and registers it for child components
 * to discover. Any ProgressBar components rendered within this context will
 * automatically detect they are part of a stacked group.
 */
export function initProgressStackedState(props: ProgressStackedProps): ProgressStackedState {
    const rootState = new ProgressStackedState(props);
    return ProgressStackedContext.set(rootState);
}

/**
 * Initializes a progress bar state, automatically detecting if it's within
 * a stacked progress context. This allows the same ProgressBar component
 * to be used both as a standalone bar or as part of a stacked group.
 */
export function initProgressState(props: ProgressProps): ProgressState {
    if (ProgressStackedContext.exists()) {
        const rootState = ProgressStackedContext.get();
        return new ProgressState(props, rootState);
    } else {
        return new ProgressState(props);
    }
}
