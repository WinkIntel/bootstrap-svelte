<script lang="ts">
    import ButtonCheck from '../button-check.svelte';
    let {
        association = 'named',
        objectValue = false,
        initial = 'b',
        duplicate = false
    }: {
        association?: 'named' | 'nameless' | 'names' | 'forms';
        objectValue?: boolean;
        initial?: 'a' | 'b' | 'uncontrolled';
        duplicate?: boolean;
    } = $props();
    // svelte-ignore state_referenced_locally
    const a = objectValue ? { id: 'a' } : 'a';
    // svelte-ignore state_referenced_locally
    const b = duplicate ? a : objectValue ? { id: 'b' } : 'b';
    // svelte-ignore state_referenced_locally
    let checkedA = $state<boolean | undefined>(initial === 'uncontrolled' ? undefined : initial === 'a');
    // svelte-ignore state_referenced_locally
    let checkedB = $state<boolean | undefined>(initial === 'b');
    let group = $state<unknown>(undefined);
    let calls = $state(0);
</script>

<form id="flush-a">
    <ButtonCheck
        type="radio"
        name={association === 'nameless' ? undefined : 'choices'}
        value={a}
        bind:group
        bind:checked={checkedA}
        onchange={() => calls++}>A</ButtonCheck>
    <ButtonCheck
        type="radio"
        name={association === 'nameless' ? undefined : association === 'names' ? 'other' : 'choices'}
        form={association === 'forms' ? 'flush-b' : undefined}
        value={b}
        bind:group
        bind:checked={checkedB}
        onchange={() => calls++}>B</ButtonCheck>
</form>
<form id="flush-b"></form>
<button data-action="a" onclick={() => (checkedA = true)}>A checked</button>
<button
    data-action="swap"
    onclick={() => {
        checkedA = false;
        checkedB = true;
    }}>Swap</button>
<button data-action="select-a" onclick={() => (group = a)}>Group A</button>
<button data-action="clear" onclick={() => (group = null)}>Clear</button>
<button data-action="release" onclick={() => (checkedA = undefined)}>Release</button>
<button data-action="false" onclick={() => (checkedA = false)}>False</button>
<button
    data-action="parent-false"
    onclick={() => {
        checkedA = false;
        group = b;
    }}>Parent selection on adoption</button>
<button
    data-action="parent-false-reverse"
    onclick={() => {
        group = b;
        checkedA = false;
    }}>Parent selection on adoption reversed</button>
<button
    data-action="parent-reverse"
    onclick={() => {
        group = b;
        checkedA = true;
    }}>Parent authority reversed</button>
<button
    data-action="parent"
    onclick={() => {
        checkedA = true;
        group = b;
    }}>Parent authority</button>
<output>{group === undefined ? 'undefined' : JSON.stringify(group)}:{String(checkedA)}:{String(checkedB)}:{calls}</output>
