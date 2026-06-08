import type { WithElementRef } from '$lib/common/types.js';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type CloseButtonRootProps = WithElementRef<HTMLButtonAttributes> & {
    disabled?: boolean;
    ariaLabel?: string;
};
