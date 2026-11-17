<script lang="ts">
    import { Pagination } from '$lib/Pagination/index.js';
    let { isStateful = true, isControl = true, disabled = false }: { isStateful?: boolean; isControl?: boolean; disabled?: boolean } = $props();
    let calls = $state(0);
</script>

<Pagination.Root {isStateful} data-testid="controls-root">
    <Pagination.Item {isControl} data-testid="prev-item"
        ><Pagination.Link href="#previous" data-testid="prev-link" onclick={() => calls++}>Previous</Pagination.Link></Pagination.Item>
    <Pagination.Item data-testid="page-item" isActive><Pagination.Link href="#page">Page</Pagination.Link></Pagination.Item>
    <Pagination.Item {isControl} data-testid="next-item"
        ><Pagination.Link href="#next" data-testid="next-link" onclick={() => calls++}>Next</Pagination.Link></Pagination.Item>
    <Pagination.Item {isControl} data-testid="ellipsis-item"
        ><Pagination.Link href="#more" data-testid="ellipsis-link" onclick={() => calls++}>…</Pagination.Link></Pagination.Item>
    <Pagination.Item isControl isDisabled={disabled} data-testid="disabled-control"
        ><Pagination.Link href="#last" data-testid="disabled-control-link" onclick={() => calls++}>Last</Pagination.Link></Pagination.Item>
</Pagination.Root>
<output data-testid="control-calls">{calls}</output>
