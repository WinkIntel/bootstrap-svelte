<script lang="ts">
    import CheckInput from '../form-check-input.svelte';
    import SwitchInput from '../form-switch-input.svelte';
    let {
        switchOnly = false,
        mixed = false,
        defaultA = false,
        defaultB = true,
        cancel = false
    }: { switchOnly?: boolean; mixed?: boolean; defaultA?: boolean; defaultB?: boolean; cancel?: boolean } = $props();
    const A = $derived(switchOnly ? SwitchInput : CheckInput);
    const B = $derived(switchOnly || mixed ? SwitchInput : CheckInput);
    let group = $state<unknown[]>(['a', 'outside']);
    let calls = $state(0);
</script>

<form
    onreset={(event) => {
        if (cancel) event.preventDefault();
    }}>
    <A value="a" name="choices" defaultChecked={defaultA} bind:group onchange={() => calls++} />
    <B value="b" name="choices" defaultChecked={defaultB} bind:group onchange={() => calls++} />
    <A value="c" name="choices" defaultChecked={false} bind:group onchange={() => calls++} />
    <button type="reset">Reset</button>
</form>
<CheckInput value="outside" name="choices" bind:group />
<output>{JSON.stringify(group)}:{calls}</output>
