<script lang="ts">
    import { Pagination } from '$lib/Pagination/index.js';

    let { class: className, ...restOfProps }: Pagination.RootProps = $props();
</script>

<!-- Basic Pagination Example -->
<div class="mb-5">
    <h4 data-testid="test-header">Basic Pagination Example</h4>
    <Pagination.Root data-testid="basic-pagination" class={className} {...restOfProps}>
        <Pagination.Item data-testid="pagination-item-prev" isDisabled={true}>
            <Pagination.Link data-testid="pagination-link-prev" href="#!" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </Pagination.Link>
        </Pagination.Item>
        <Pagination.Item data-testid="pagination-item-1">
            <Pagination.Link data-testid="pagination-link-1" href="#!">1</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item data-testid="pagination-item-2" isActive={true}>
            <Pagination.Link data-testid="pagination-link-2" href="#!">2</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item data-testid="pagination-item-3">
            <Pagination.Link data-testid="pagination-link-3" href="#!">3</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item data-testid="pagination-item-next">
            <Pagination.Link data-testid="pagination-link-next" href="#!" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </Pagination.Link>
        </Pagination.Item>
    </Pagination.Root>
</div>

<!-- Pagination Sizes -->
<div class="mb-5">
    <h4>Pagination Sizes</h4>
    <div class="mb-3">
        <h5>Small Pagination</h5>
        <Pagination.Root data-testid="pagination-sm" size="sm">
            <Pagination.Item>
                <Pagination.Link href="#!">1</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item isActive={true}>
                <Pagination.Link href="#!">2</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
                <Pagination.Link href="#!">3</Pagination.Link>
            </Pagination.Item>
        </Pagination.Root>
    </div>

    <div class="mb-3">
        <h5>Default Pagination</h5>
        <Pagination.Root data-testid="pagination-default">
            <Pagination.Item>
                <Pagination.Link href="#!">1</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item isActive={true}>
                <Pagination.Link href="#!">2</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
                <Pagination.Link href="#!">3</Pagination.Link>
            </Pagination.Item>
        </Pagination.Root>
    </div>

    <div class="mb-3">
        <h5>Large Pagination</h5>
        <Pagination.Root data-testid="pagination-lg" size="lg">
            <Pagination.Item>
                <Pagination.Link href="#!">1</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item isActive={true}>
                <Pagination.Link href="#!">2</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
                <Pagination.Link href="#!">3</Pagination.Link>
            </Pagination.Item>
        </Pagination.Root>
    </div>
</div>

<!-- Pagination Alignments -->
<div class="mb-5">
    <h4>Pagination Alignments</h4>
    <div class="mb-3">
        <h5>Default (Start) Alignment</h5>
        <Pagination.Root data-testid="pagination-start">
            <Pagination.Item>
                <Pagination.Link href="#!">1</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item isActive={true}>
                <Pagination.Link href="#!">2</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
                <Pagination.Link href="#!">3</Pagination.Link>
            </Pagination.Item>
        </Pagination.Root>
    </div>

    <div class="mb-3">
        <h5>Center Alignment</h5>
        <Pagination.Root data-testid="pagination-center" alignment="center">
            <Pagination.Item>
                <Pagination.Link href="#!">1</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item isActive={true}>
                <Pagination.Link href="#!">2</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
                <Pagination.Link href="#!">3</Pagination.Link>
            </Pagination.Item>
        </Pagination.Root>
    </div>

    <div class="mb-3">
        <h5>End Alignment</h5>
        <Pagination.Root data-testid="pagination-end" alignment="end">
            <Pagination.Item>
                <Pagination.Link href="#!">1</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item isActive={true}>
                <Pagination.Link href="#!">2</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
                <Pagination.Link href="#!">3</Pagination.Link>
            </Pagination.Item>
        </Pagination.Root>
    </div>
</div>
