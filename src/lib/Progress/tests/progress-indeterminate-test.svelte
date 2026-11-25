<script lang="ts">
    import { ProgressBar, ProgressStacked } from '../index.js';
    import type { ProgressProps } from '../types.js';

    let { stacked = false, ...props }: ProgressProps & { stacked?: boolean } = $props();
</script>

{#if stacked}
    <ProgressStacked>
        <ProgressBar {...props} />
    </ProgressStacked>
{:else}
    <ProgressBar {...props} />
{/if}
