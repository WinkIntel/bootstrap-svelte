<script lang="ts">
    import { collapseAria } from '../collapse-aria-attachment.svelte.js';
    let { first = true, second = true }: { first?: boolean; second?: boolean } = $props();
</script>

<button
    data-testid="overlap-control"
    {@attach first && collapseAria({ ariaControls: 'one', ariaExpanded: false })}
    {@attach second && collapseAria({ ariaControls: 'two', ariaExpanded: true })}>Toggle</button>
