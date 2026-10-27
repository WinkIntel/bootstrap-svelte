<script lang="ts">
    import { Navbar } from '../index.js';
    let { onCollapsed, onoutroend }: Pick<Navbar.CollapseProps, 'onCollapsed' | 'onoutroend'> = $props();
</script>

<Navbar.Root expandOnBreakpoint="lg">
    <Navbar.Toggler data-testid="toggle" />
    <Navbar.Collapse {onCollapsed} {onoutroend} transitionDuration={0} data-testid="panel">Content</Navbar.Collapse>
</Navbar.Root>
