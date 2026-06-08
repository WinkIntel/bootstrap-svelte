<script lang="ts">
    import { Badge, ListGroup } from '$lib/index.js';

    let { class: className, ...restOfProps }: ListGroup.RootProps = $props();
</script>

<!-- Basic ListGroup Example -->
<div class="mb-5">
    <h4 data-testid="test-header">Basic ListGroup Example</h4>
    <ListGroup.Root data-testid="basic-list-group" class={className} {...restOfProps}>
        <ListGroup.Item data-testid="list-group-item-1">First item</ListGroup.Item>
        <ListGroup.Item data-testid="list-group-item-2" isActive={true}>Second item (active)</ListGroup.Item>
        <ListGroup.Item data-testid="list-group-item-3">Third item</ListGroup.Item>
        <ListGroup.Item data-testid="list-group-item-4">Fourth item</ListGroup.Item>
        <ListGroup.Item data-testid="list-group-item-5">Fifth item</ListGroup.Item>
    </ListGroup.Root>
</div>

<!-- ListGroup Style Variants -->
<div class="mb-5">
    <h4>ListGroup Style Variants</h4>
    <div class="mb-3">
        <h5>Flush ListGroup</h5>
        <ListGroup.Root data-testid="list-group-flush" isFlush={true}>
            <ListGroup.Item>First item</ListGroup.Item>
            <ListGroup.Item>Second item</ListGroup.Item>
            <ListGroup.Item>Third item</ListGroup.Item>
        </ListGroup.Root>
    </div>

    <div class="mb-3">
        <h5>Numbered ListGroup</h5>
        <ListGroup.Root data-testid="list-group-numbered" isNumbered={true}>
            <ListGroup.Item>First item</ListGroup.Item>
            <ListGroup.Item>Second item</ListGroup.Item>
            <ListGroup.Item>Third item</ListGroup.Item>
        </ListGroup.Root>
    </div>

    <div class="mb-3">
        <h5>Combined: Flush and Numbered ListGroup</h5>
        <ListGroup.Root data-testid="list-group-combined" isFlush={true} isNumbered={true}>
            <ListGroup.Item>First item</ListGroup.Item>
            <ListGroup.Item>Second item</ListGroup.Item>
            <ListGroup.Item>Third item</ListGroup.Item>
        </ListGroup.Root>
    </div>
</div>

<!-- Horizontal ListGroup -->
<div class="mb-5">
    <h4>Horizontal ListGroups</h4>
    <div class="mb-3">
        <h5>Horizontal on all breakpoints (xs)</h5>
        <ListGroup.Root data-testid="list-group-horizontal-xs" horizontalOnBreakpoint="xs">
            <ListGroup.Item>First item</ListGroup.Item>
            <ListGroup.Item>Second item</ListGroup.Item>
            <ListGroup.Item>Third item</ListGroup.Item>
        </ListGroup.Root>
    </div>

    <div class="mb-3">
        <h5>Horizontal on md and up</h5>
        <ListGroup.Root data-testid="list-group-horizontal-md" horizontalOnBreakpoint="md">
            <ListGroup.Item>First item</ListGroup.Item>
            <ListGroup.Item>Second item</ListGroup.Item>
            <ListGroup.Item>Third item</ListGroup.Item>
        </ListGroup.Root>
    </div>
</div>

<!-- ListGroup Item Variants -->
<div class="mb-5">
    <h4>ListGroup Item Variants</h4>
    <div class="mb-3">
        <h5>Color Variants</h5>
        <ListGroup.Root data-testid="list-group-colors">
            <ListGroup.Item data-testid="list-group-item-primary" colorVariant="primary">Primary</ListGroup.Item>
            <ListGroup.Item data-testid="list-group-item-secondary" colorVariant="secondary">Secondary</ListGroup.Item>
            <ListGroup.Item data-testid="list-group-item-success" colorVariant="success">Success</ListGroup.Item>
            <ListGroup.Item data-testid="list-group-item-danger" colorVariant="danger">Danger</ListGroup.Item>
            <ListGroup.Item data-testid="list-group-item-warning" colorVariant="warning">Warning</ListGroup.Item>
            <ListGroup.Item data-testid="list-group-item-info" colorVariant="info">Info</ListGroup.Item>
            <ListGroup.Item data-testid="list-group-item-light" colorVariant="light">Light</ListGroup.Item>
            <ListGroup.Item data-testid="list-group-item-dark" colorVariant="dark">Dark</ListGroup.Item>
        </ListGroup.Root>
    </div>

    <div class="mb-3">
        <h5>Active and Colored Items</h5>
        <ListGroup.Root data-testid="list-group-active-colors">
            <ListGroup.Item data-testid="list-group-item-active-primary" isActive={true} colorVariant="primary">Active Primary</ListGroup.Item>
            <ListGroup.Item data-testid="list-group-item-active-success" isActive={true} colorVariant="success">Active Success</ListGroup.Item>
        </ListGroup.Root>
    </div>
</div>

<!-- ListGroup with Actions -->
<div class="mb-5">
    <h4>ListGroup with Action Items</h4>
    <ListGroup.Root data-testid="list-group-action">
        <ListGroup.ItemAction data-testid="list-group-action-1" href="#!" isActive={true}>Active link item</ListGroup.ItemAction>
        <ListGroup.ItemAction data-testid="list-group-action-2" href="#!" id="custom-list-group-action-id">Normal link item</ListGroup.ItemAction>
        <ListGroup.ItemAction data-testid="list-group-action-3" href="#!" isDisabled={true}>Disabled link item</ListGroup.ItemAction>
        <ListGroup.ItemAction data-testid="list-group-action-4" onclick={() => console.log('clicked')}>Button item</ListGroup.ItemAction>
        <ListGroup.ItemAction data-testid="list-group-action-5" isDisabled={true}>Disabled button item</ListGroup.ItemAction>
    </ListGroup.Root>
</div>

<!-- ListGroup with Badges -->
<div class="mb-5">
    <h4>ListGroup with Badges</h4>
    <ListGroup.Root data-testid="list-group-badges">
        <ListGroup.Item data-testid="list-group-badge-item-1" class="d-flex justify-content-between align-items-center">
            First item with badge
            <Badge data-testid="badge-1" isPill={true}>14</Badge>
        </ListGroup.Item>
        <ListGroup.Item data-testid="list-group-badge-item-2" class="d-flex justify-content-between align-items-center">
            Second item with badge
            <Badge data-testid="badge-2" isPill={true}>2</Badge>
        </ListGroup.Item>
    </ListGroup.Root>
</div>

<!-- ListGroup with Custom Content -->
<div class="mb-5">
    <h4>ListGroup with Custom Content</h4>
    <ListGroup.Root data-testid="list-group-custom-content">
        <ListGroup.ItemAction data-testid="list-group-custom-item-1" href="#" isActive={true}>
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">List group item heading</h5>
                <small>3 days ago</small>
            </div>
            <p class="mb-1" data-testid="custom-content-paragraph">Some placeholder content in a paragraph.</p>
            <small>And some small print.</small>
        </ListGroup.ItemAction>
    </ListGroup.Root>
</div>

<!-- ListGroup with Form Elements -->
<div class="mb-5">
    <h4>ListGroup with Form Elements</h4>
    <ListGroup.Root data-testid="list-group-form-elements">
        <ListGroup.Item data-testid="list-group-checkbox-item">
            <input data-testid="checkbox-input" type="checkbox" class="form-check-input me-1" />
            Checkbox item
        </ListGroup.Item>
        <ListGroup.Item data-testid="list-group-radio-item">
            <input data-testid="radio-input" type="radio" name="options" class="form-check-input me-1" />
            Radio item
        </ListGroup.Item>
    </ListGroup.Root>
</div>
