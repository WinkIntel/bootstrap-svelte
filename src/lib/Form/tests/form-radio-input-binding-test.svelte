<script lang="ts">
    import RadioInput from '../form-radio-input.svelte';

    let group = $state<string | undefined>(undefined);
    let lateChecked = $state<boolean | undefined>(undefined);
    let standaloneChecked = $state(false);
</script>

<RadioInput bind:group data-testid="group-one" value="one" />
<RadioInput bind:group data-testid="group-two" value="two" />
<RadioInput bind:checked={standaloneChecked} data-testid="standalone-radio" value="standalone" />
<RadioInput bind:checked={lateChecked} data-testid="late-checked-radio" value="late" />
<button data-testid="clear-group" onclick={() => (group = undefined)}>Clear group</button>
<button data-testid="clear-standalone" onclick={() => (standaloneChecked = false)}>Clear standalone</button>
<button data-testid="set-late-checked-true" onclick={() => (lateChecked = true)}>Set late checked true</button>
<button data-testid="set-late-checked-false" onclick={() => (lateChecked = false)}>Set late checked false</button>
<output data-testid="group-value">{group ?? 'unset'}</output>
<output data-testid="late-checked">{String(lateChecked)}</output>
<output data-testid="standalone-checked">{String(standaloneChecked)}</output>
