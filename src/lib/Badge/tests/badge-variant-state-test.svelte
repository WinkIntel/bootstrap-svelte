<script lang="ts">
    import Badge from '../badge.svelte';

    let classValue = $state<string | undefined>(undefined);
    let colorVariant = $state<'text-bg-success' | undefined>(undefined);
</script>

<button data-testid="set-badge-class" onclick={() => (classValue = 'text-bg-secondary')}>Set class</button>
<button data-testid="set-badge-variant" onclick={() => (colorVariant = 'text-bg-success')}>Set variant</button>
<button data-testid="clear-badge-variant" onclick={() => (colorVariant = undefined)}>Clear variant</button>
<button data-testid="clear-badge-class" onclick={() => (classValue = undefined)}>Clear class</button>

<Badge data-testid="stateful-badge" class={classValue} {colorVariant}>Stateful badge</Badge>
