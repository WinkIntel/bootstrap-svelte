<script lang="ts">
    import { Nav, Tab } from '$lib/index.js';
</script>

<Tab.Root>
    <Nav.Root aria-label="Outer tabs">
        <Nav.Item><Nav.Link href="#outer-pane" isActive>Outer</Nav.Link></Nav.Item>
    </Nav.Root>
    <Tab.Content>
        <Tab.Pane id="outer-pane" isActive>
            <Nav.Root data-testid="pane-nav" itemStyle="tabs">
                <Nav.Item><Nav.Link href="/settings">Settings</Nav.Link></Nav.Item>
            </Nav.Root>
            <Tab.Root>
                <Nav.Root aria-label="Inner tabs">
                    <Nav.Item><Nav.Link href="#inner-pane" isActive>Inner</Nav.Link></Nav.Item>
                </Nav.Root>
                <Tab.Pane id="inner-pane" isActive>Inner content</Tab.Pane>
            </Tab.Root>
        </Tab.Pane>
    </Tab.Content>
</Tab.Root>
