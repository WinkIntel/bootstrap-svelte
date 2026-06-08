<script lang="ts">
    import { Table } from '$lib/index.js';

    interface Props {
        isResponsive?: boolean;
        responsiveBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    }

    let { isResponsive = false, responsiveBreakpoint }: Props = $props();
    let responsiveProps = $derived(responsiveBreakpoint ? { breakpoint: responsiveBreakpoint } : {});
</script>

<Table.Root {isResponsive} {responsiveProps}>
    {#snippet tableContainerFooter()}
        <div class="table-footer-content" data-testid="footer-content">Table footer content</div>
    {/snippet}
    <Table.Head>
        <Table.Row>
            <Table.Header>#</Table.Header>
            <Table.Header>First Name</Table.Header>
            <Table.Header>Last Name</Table.Header>
            <Table.Header>Username</Table.Header>
        </Table.Row>
    </Table.Head>
    <Table.Body>
        <Table.Row>
            <Table.Header>1</Table.Header>
            <Table.Data>Mark</Table.Data>
            <Table.Data>Otto</Table.Data>
            <Table.Data>@mdo</Table.Data>
        </Table.Row>
        <Table.Row>
            <Table.Header>2</Table.Header>
            <Table.Data>Jacob</Table.Data>
            <Table.Data>Thornton</Table.Data>
            <Table.Data>@fat</Table.Data>
        </Table.Row>
        <Table.Row>
            <Table.Header>3</Table.Header>
            <Table.Data>Larry</Table.Data>
            <Table.Data>the Bird</Table.Data>
            <Table.Data>@twitter</Table.Data>
        </Table.Row>
    </Table.Body>
</Table.Root>
