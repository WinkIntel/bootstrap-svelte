<script lang="ts">
    import { Offcanvas } from '$lib/index.js';
    import type { OffcanvasBackdrop } from '../types.js';

    let isAShown = $state(false);
    let isBShown = $state(false);
    let bBackdrop: OffcanvasBackdrop = $state(true);
    let aHidePreventedCount = $state(0);
    let bHidePreventedCount = $state(0);
</script>

<button data-testid="open-offcanvas-a" onclick={() => (isAShown = true)}>Open A</button>
<button data-testid="open-offcanvas-b" onclick={() => (isBShown = true)}>Open B</button>
<button data-testid="make-offcanvas-b-static" onclick={() => (bBackdrop = 'static')}>Make B static</button>
<output data-testid="offcanvas-a-prevented-count">{aHidePreventedCount}</output>
<output data-testid="offcanvas-b-prevented-count">{bHidePreventedCount}</output>

<Offcanvas.Root data-testid="stacked-offcanvas-a" id="stacked-offcanvas-a" isShown={isAShown} onHidePrevented={() => (aHidePreventedCount += 1)}>
    <Offcanvas.Body>
        <button data-testid="offcanvas-a-content">A content</button>
    </Offcanvas.Body>
</Offcanvas.Root>

<Offcanvas.Root
    data-testid="stacked-offcanvas-b"
    id="stacked-offcanvas-b"
    isShown={isBShown}
    onHidePrevented={() => (bHidePreventedCount += 1)}
    useBackdrop={bBackdrop}>
    <Offcanvas.Body>
        <button data-testid="offcanvas-b-content">B content</button>
    </Offcanvas.Body>
</Offcanvas.Root>
