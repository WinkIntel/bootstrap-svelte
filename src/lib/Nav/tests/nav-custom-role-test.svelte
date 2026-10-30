<script lang="ts">
    import { Nav } from '$lib/index.js';
</script>

<Nav.Root role="tablist" itemStyle="tabs" verticalBreakpoint="xs" aria-label="Custom tabs">
    <Nav.Item role="presentation">
        <Nav.Link role="tab" href="#custom-pane" aria-controls="custom-pane" aria-selected="true">Custom</Nav.Link>
    </Nav.Item>
</Nav.Root>
