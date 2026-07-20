export type OverlayStackEntry = {
    baseBackdropZIndex: number;
    baseOverlayZIndex: number;
    containsActiveElement?: () => boolean;
    focus?: () => void;
    onKeydown: (event: KeyboardEvent) => void;
    setLayers: (overlayZIndex: number | undefined, backdropZIndex: number | undefined) => void;
};

const overlayStack: OverlayStackEntry[] = [];
const overlayLayerStep = 20;

function handleKeydown(event: KeyboardEvent): void {
    overlayStack.at(-1)?.onKeydown(event);
}

function syncKeydownListener(): void {
    if (typeof window === 'undefined') return;

    window.removeEventListener('keydown', handleKeydown);
    if (overlayStack.length > 0) {
        window.addEventListener('keydown', handleKeydown);
    }
}

function syncLayers(): void {
    let previousOverlayZIndex = Number.NEGATIVE_INFINITY;

    overlayStack.forEach((entry) => {
        const overlayZIndex = Math.max(entry.baseOverlayZIndex, previousOverlayZIndex + overlayLayerStep);
        const backdropZIndex = overlayZIndex - (entry.baseOverlayZIndex - entry.baseBackdropZIndex);
        entry.setLayers(overlayZIndex, backdropZIndex);
        previousOverlayZIndex = overlayZIndex;
    });
}

export function registerOverlay(entry: OverlayStackEntry): void {
    const existingIndex = overlayStack.indexOf(entry);
    if (existingIndex !== -1) {
        overlayStack.splice(existingIndex, 1);
    }

    overlayStack.push(entry);
    syncLayers();
    syncKeydownListener();
}

export function unregisterOverlay(entry: OverlayStackEntry): void {
    const index = overlayStack.indexOf(entry);
    if (index === -1) return;

    overlayStack.splice(index, 1);
    entry.setLayers(undefined, undefined);
    syncLayers();
    syncKeydownListener();
}

export function isTopOverlay(entry: OverlayStackEntry): boolean {
    return overlayStack.at(-1) === entry;
}

export function focusTopOverlay(): void {
    overlayStack.at(-1)?.focus?.();
}

export function isFocusInTopOverlay(): boolean {
    return overlayStack.at(-1)?.containsActiveElement?.() ?? false;
}
