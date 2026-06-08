<script lang="ts">
    import { Breadcrumb } from '$lib/index.js';

    let { class: className, ...restOfProps }: Breadcrumb.RootProps = $props();
</script>

<!-- Basic Breadcrumb Example -->
<div class="mb-5">
    <h4 data-testid="test-header">Basic Breadcrumb Example</h4>
    <Breadcrumb.Root data-testid="basic-breadcrumb" class={className} {...restOfProps}>
        <Breadcrumb.Item data-testid="breadcrumb-item-home" href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item data-testid="breadcrumb-item-library" href="/library">Library</Breadcrumb.Item>
        <Breadcrumb.Item data-testid="breadcrumb-item-data" isActive={true}>Data</Breadcrumb.Item>
    </Breadcrumb.Root>
</div>

<!-- Breadcrumb with Custom Divider -->
<div class="mb-5">
    <h4>Custom Divider</h4>
    <div class="mb-3">
        <h5>Using Character Divider</h5>
        <Breadcrumb.Root data-testid="breadcrumb-custom-divider" divider=">">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/library">Library</Breadcrumb.Item>
            <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
        </Breadcrumb.Root>
    </div>

    <div class="mb-3">
        <h5>Using SVG Divider</h5>
        <Breadcrumb.Root
            data-testid="breadcrumb-svg-divider"
            divider="url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E)">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/library">Library</Breadcrumb.Item>
            <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
        </Breadcrumb.Root>
    </div>

    <div class="mb-3">
        <h5>No Divider</h5>
        <Breadcrumb.Root data-testid="breadcrumb-no-divider" divider="">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/library">Library</Breadcrumb.Item>
            <Breadcrumb.Item isActive={true}>Data</Breadcrumb.Item>
        </Breadcrumb.Root>
    </div>
</div>
