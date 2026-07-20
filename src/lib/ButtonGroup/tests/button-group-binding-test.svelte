<script lang="ts">
    import { ButtonGroup, ButtonToolbar } from '$lib/index.js';

    let groupRef = $state<HTMLDivElement | null>(null);
    let toolbarRef = $state<HTMLDivElement | null>(null);
</script>

<ButtonToolbar bind:elementRef={toolbarRef} data-testid="toolbar-ref">
    <ButtonGroup bind:elementRef={groupRef} data-testid="group-ref">Buttons</ButtonGroup>
</ButtonToolbar>
<output data-testid="button-group-binding-state">{groupRef?.dataset.testid}:{toolbarRef?.dataset.testid}</output>
