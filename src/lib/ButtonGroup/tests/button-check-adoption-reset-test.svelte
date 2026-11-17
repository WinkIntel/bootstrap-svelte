<script lang="ts">
    import ButtonCheck from '../button-check.svelte';
    let {
        initialChecked,
        controlB = true,
        defaultA = false,
        defaultB = false,
        duplicate = false,
        objectValue = false,
        cancelReset = false,
        overrideReset
    }: {
        initialChecked?: boolean;
        controlB?: boolean;
        defaultA?: boolean;
        defaultB?: boolean;
        duplicate?: boolean;
        objectValue?: boolean;
        cancelReset?: boolean;
        overrideReset?: 'group' | 'checked';
    } = $props();
    // The fixture intentionally fixes object identities and duplicate membership at mount.
    // svelte-ignore state_referenced_locally
    const a = objectValue ? { id: 'a' } : 'a';
    // svelte-ignore state_referenced_locally
    const b = duplicate ? a : objectValue ? { id: 'b' } : 'b';
    // The fixture intentionally seeds checked ownership once.
    // svelte-ignore state_referenced_locally
    let checkedA = $state(initialChecked);
    // svelte-ignore state_referenced_locally
    let checkedB = $state(controlB ? initialChecked : undefined);
    let group = $state<unknown>(undefined);
    let calls = $state(0);
    let resetting = $state(false);
    $effect(() => {
        if (resetting && overrideReset && checkedA && group === a) {
            resetting = false;
            if (overrideReset === 'group') group = b;
            else checkedA = false;
        }
    });
</script>

<form
    onreset={(event) => {
        if (cancelReset) event.preventDefault();
        else resetting = true;
    }}>
    <ButtonCheck type="radio" name="choices" value={a} defaultChecked={defaultA} bind:group bind:checked={checkedA} onchange={() => calls++}
        >A</ButtonCheck>
    <ButtonCheck type="radio" name="choices" value={b} defaultChecked={defaultB} bind:group bind:checked={checkedB} onchange={() => calls++}
        >B</ButtonCheck>
</form>
<button data-action="select-a" onclick={() => (group = a)}>Select A</button>
<button data-action="select-b" onclick={() => (group = b)}>Select B</button>
<button data-action="release-a" onclick={() => (checkedA = undefined)}>Release A</button>
<button data-action="adopt-true" onclick={() => (checkedA = true)}>Adopt true</button>
<button data-action="adopt-false" onclick={() => (checkedA = false)}>Adopt false</button>
<button data-action="release-b" onclick={() => (checkedB = undefined)}>Release B</button>
<button data-action="adopt-false-b" onclick={() => (checkedB = false)}>Adopt false B</button>
<button
    data-action="adopt-b"
    onclick={() => {
        checkedA = false;
        group = b;
    }}>Adopt false and select B</button>
<output>{group === undefined ? 'undefined' : JSON.stringify(group)}:{String(checkedA)}:{String(checkedB)}:{calls}</output>
