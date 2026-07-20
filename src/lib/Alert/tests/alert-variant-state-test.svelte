<script lang="ts">
    import Alert from '../alert.svelte';

    let classValue = $state<string | undefined>(undefined);
    let colorVariant = $state<'success' | undefined>(undefined);
</script>

<button data-testid="set-alert-class" onclick={() => (classValue = 'text-bg-secondary')}>Set class</button>
<button data-testid="set-alert-variant" onclick={() => (colorVariant = 'success')}>Set variant</button>
<button data-testid="clear-alert-variant" onclick={() => (colorVariant = undefined)}>Clear variant</button>
<button data-testid="clear-alert-class" onclick={() => (classValue = undefined)}>Clear class</button>

<Alert data-testid="stateful-alert" class={classValue} {colorVariant} isAnimated={false}>Stateful alert</Alert>
