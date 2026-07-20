<script lang="ts">
    import { Nav } from '$lib/index.js';

    let { class: className, ...restOfProps }: Nav.RootProps = $props();
    let hashClicks = $state(0);
    let enabledClicks = $state(0);
    let disabledClicks = $state(0);
</script>

<!-- Basic Nav Example -->
<div class="mb-5">
    <h4 data-testid="test-header">Basic Nav Example</h4>
    <Nav.Root data-testid="basic-nav" class={className} {...restOfProps}>
        <Nav.Item data-testid="nav-item-active">
            <Nav.Link data-testid="nav-link-active" href="#!" isActive={true}>Active</Nav.Link>
        </Nav.Item>
        <Nav.Item data-testid="nav-item-link">
            <Nav.Link data-testid="nav-link" href="#!">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item data-testid="nav-item-another-link">
            <Nav.Link data-testid="another-nav-link" href="#!">Another Link</Nav.Link>
        </Nav.Item>
        <Nav.Item data-testid="nav-item-disabled">
            <Nav.Link data-testid="disabled-nav-link" href="#!" isDisabled={true}>Disabled</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</div>

<!-- Nav with different element types examples -->
<div class="mb-5">
    <div class="mb-3">
        <h5>As UL Element (Default)</h5>
        <Nav.Root data-testid="as-ul-element">
            <Nav.Item>
                <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="#!">Link</Nav.Link>
            </Nav.Item>
        </Nav.Root>
    </div>

    <div class="mb-3">
        <h5>As OL Element</h5>
        <Nav.Root data-testid="as-ol-element" elementType="ol">
            <Nav.Item>
                <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="#!">Link</Nav.Link>
            </Nav.Item>
        </Nav.Root>
    </div>

    <h4>Nav Element Types Examples</h4>
    <div class="mb-3">
        <h5>As Nav Element</h5>
        <Nav.Root data-testid="as-nav-element" elementType="nav">
            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
            <Nav.Link href="#!">Link</Nav.Link>
        </Nav.Root>
    </div>
</div>

<!-- Pills Nav Example -->
<div class="mb-5">
    <h4>Pills Nav Example</h4>
    <Nav.Root data-testid="pills-nav" itemStyle="pills">
        <Nav.Item>
            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Another Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</div>

<!-- Tabs Nav Example -->
<div class="mb-5">
    <h4>Tabs Nav Example</h4>
    <Nav.Root data-testid="tabs-nav" itemStyle="tabs">
        <Nav.Item>
            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Another Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</div>

<!-- Vertical Nav Example -->
<div class="mb-5">
    <h4>Vertical Nav Example</h4>
    <Nav.Root data-testid="vertical-nav" verticalBreakpoint="xs">
        <Nav.Item>
            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Another Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</div>

<!-- Justified Nav Example -->
<div class="mb-5">
    <h4>Justified Nav Example</h4>
    <Nav.Root data-testid="justified-nav" itemLayout="justified">
        <Nav.Item>
            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Another Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</div>

<!-- Fill Nav Example -->
<div class="mb-5">
    <h4>Fill Nav Example</h4>
    <Nav.Root data-testid="fill-nav" itemLayout="fill">
        <Nav.Item>
            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Another Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</div>

<!-- Nav with Divider Example -->
<div class="mb-5">
    <h4>Nav with Divider Example</h4>
    <Nav.Root data-testid="nav-with-divider">
        <Nav.Item>
            <Nav.Link href="#!" isActive={true}>Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!">Another Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#!" isDisabled={true}>Disabled</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</div>

<!-- Navigation Example (with isNavigation prop) -->
<div class="mb-5">
    <h4>Navigation Example (with role prop)</h4>
    <Nav.Root data-testid="navigation-nav">
        <Nav.Item>
            <Nav.Link href="/home" isActive={true}>Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/about">About</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/contact">Contact</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</div>

<!-- Navigation Example with Nav Element -->
<div class="mb-5">
    <h4>Navigation Example with Nav Element (without role prop)</h4>
    <Nav.Root data-testid="navigation-as-nav" elementType="nav">
        <Nav.Link href="/home" isActive={true}>Home</Nav.Link>
        <Nav.Link href="/about">About</Nav.Link>
        <Nav.Link href="/contact">Contact</Nav.Link>
    </Nav.Root>
</div>

<!-- Interaction contract examples -->
<div class="mb-5">
    <h4>Interaction Contract Examples</h4>
    <Nav.Root class="mb-3">
        <Nav.Item>
            <Nav.Link data-testid="hash-nav-link" href="#!" onclick={() => (hashClicks += 1)}>Hash Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link data-testid="enabled-nav-link" href="/page" aria-current="location" tabindex={5} onclick={() => (enabledClicks += 1)}>
                Enabled Link
            </Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link
                data-testid="disabled-interaction-nav-link"
                href="/disabled"
                isDisabled={true}
                aria-disabled="false"
                tabindex={8}
                onclick={() => (disabledClicks += 1)}>
                Disabled Link
            </Nav.Link>
        </Nav.Item>
    </Nav.Root>
    <output data-testid="nav-click-counts">{hashClicks}:{enabledClicks}:{disabledClicks}</output>

    <!-- Auto ID Generation Example -->
    <Nav.Root class="mb-3">
        <Nav.Item>
            <Nav.Link data-testid="auto-id-link-1" href="#!">Auto ID 1</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link data-testid="auto-id-link-2" href="#!">Auto ID 2</Nav.Link>
        </Nav.Item>
    </Nav.Root>
</div>
