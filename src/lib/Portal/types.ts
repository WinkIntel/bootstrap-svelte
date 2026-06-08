import type { Snippet } from 'svelte';

export type PortalRootProps = {
    children: Snippet;
    disabled?: boolean;
    target: string | HTMLElement;
};
