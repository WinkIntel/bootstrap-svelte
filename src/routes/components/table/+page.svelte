<script lang="ts">
    import { Pagination, Table } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
</script>

<div>
    <div class="mb-4">
        <h1>Table</h1>
        <p class="lead">Documentation and examples for opt-in styling of tables.</p>
        <hr />
    </div>

    <section class="mb-4" id="basic-example">
        <h2 class="wk-quick-link mb-3">Basic Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Table.Root>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root>
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
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="color-variant-example">
        <h2 class="wk-quick-link mb-3">Color Variant Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Table.Root>
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>Class</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Header>Default</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row colorVariant="primary">
                                <Table.Header>Primary</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row colorVariant="secondary">
                                <Table.Header>Secondary</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row colorVariant="success">
                                <Table.Header>Success</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row colorVariant="danger">
                                <Table.Header>Danger</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row colorVariant="warning">
                                <Table.Header>Warning</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row colorVariant="info">
                                <Table.Header>Info</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row colorVariant="light">
                                <Table.Header>Light</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row colorVariant="dark">
                                <Table.Header>Dark</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<!-- On Table.Root -->
<Table.Root colorVariant="primary">...</Table.Root>
<Table.Root colorVariant="secondary">...</Table.Root>
<Table.Root colorVariant="success">...</Table.Root>
<Table.Root colorVariant="danger">...</Table.Root>
<Table.Root colorVariant="warning">...</Table.Root>
<Table.Root colorVariant="info">...</Table.Root>
<Table.Root colorVariant="light">...</Table.Root>
<Table.Root colorVariant="dark">...</Table.Root>

<!-- On Table.Row -->
<Table.Row colorVariant="primary">...</Table.Row>
<Table.Row colorVariant="secondary">...</Table.Row>
<Table.Row colorVariant="success">...</Table.Row>
<Table.Row colorVariant="danger">...</Table.Row>
<Table.Row colorVariant="warning">...</Table.Row>
<Table.Row colorVariant="info">...</Table.Row>
<Table.Row colorVariant="light">...</Table.Row>
<Table.Row colorVariant="dark">...</Table.Row>

<!-- On cells (Table.Data or Table.Header) -->
<Table.Row>
  <Table.Data colorVariant="primary">...</Table.Data>
  <Table.Data colorVariant="secondary">...</Table.Data>
  <Table.Data colorVariant="success">...</Table.Data>
  <Table.Data colorVariant="danger">...</Table.Data>
  <Table.Data colorVariant="warning">...</Table.Data>
  <Table.Data colorVariant="info">...</Table.Data>
  <Table.Data colorVariant="light">...</Table.Data>
  <Table.Data colorVariant="dark">...</Table.Data>
</Table.Row>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="striped-rows-example">
        <h2 class="wk-quick-link mb-3">Striped Rows Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Default Example</h4>
                <div class="mb-3">
                    <Table.Root isStriped>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isStriped>
    ...
</Table.Root>`} />
                <h4 class="my-3">Dark Example</h4>
                <div class="mb-3">
                    <Table.Root colorVariant="dark" isStriped>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root colorVariant="dark" isStriped>
    ...
</Table.Root>`} />
                <h4 class="my-3">Success Example</h4>
                <div class="mb-3">
                    <Table.Root colorVariant="success" isStriped>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root colorVariant="success" isStriped>
    ...
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="striped-columns-example">
        <h2 class="wk-quick-link mb-3">Striped Columns Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Default Example</h4>
                <div class="mb-3">
                    <Table.Root isStripedColumns>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isStripedColumns>
    ...
</Table.Root>`} />
                <h4 class="my-3">Dark Example</h4>
                <div class="mb-3">
                    <Table.Root isStripedColumns colorVariant="dark">
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root colorVariant="dark" isStripedColumns>
    ...
</Table.Root>`} />
                <h4 class="my-3">Success Example</h4>
                <div class="mb-3">
                    <Table.Root isStripedColumns colorVariant="success">
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root colorVariant="success" isStripedColumns>
    ...
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="color-variant-example">
        <h2 class="wk-quick-link mb-3">Hoverable Rows Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Default Example</h4>
                <div class="mb-3">
                    <Table.Root isHoverable>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isHoverable>
    ...
</Table.Root>`} />
                <h4 class="my-3">Dark Example</h4>
                <div class="mb-3">
                    <Table.Root colorVariant="dark" isHoverable>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root colorVariant="dark" isHoverable>
    ...
</Table.Root>`} />
                <h4 class="my-3">Striped Rows Example</h4>
                <div class="mb-3">
                    <Table.Root isHoverable isStriped>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isHoverable isStriped>
    ...
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="active-rows-cells-example">
        <h2 class="wk-quick-link mb-3">Active Rows and Cells Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Default Example</h4>
                <div class="mb-3">
                    <Table.Root>
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>#</Table.Header>
                                <Table.Header>First Name</Table.Header>
                                <Table.Header>Last Name</Table.Header>
                                <Table.Header>Username</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row isActive>
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
                                <Table.Data isActive>@twitter</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root>
    <Table.Head>
        ...
    </Table.Head>
    <Table.Body>
        <Table.Row isActive>
            ...
        </Table.Row>
        <Table.Row>
            ...
        </Table.Row>
        <Table.Row>
            <Table.Header>3</Table.Header>
            <Table.Data>Larry</Table.Data>
            <Table.Data>the Bird</Table.Data>
            <Table.Data isActive>@twitter</Table.Data>
        </Table.Row>
    </Table.Body>
</Table.Root>`} />
                <h4 class="my-3">Dark Example</h4>
                <div class="mb-3">
                    <Table.Root colorVariant="dark">
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>#</Table.Header>
                                <Table.Header>First Name</Table.Header>
                                <Table.Header>Last Name</Table.Header>
                                <Table.Header>Username</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row isActive>
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
                                <Table.Data isActive>@twitter</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root colorVariant="dark">
    <Table.Head>
        ...
    </Table.Head>
    <Table.Body>
        <Table.Row isActive>
            ...
        </Table.Row>
        <Table.Row>
            ...
        </Table.Row>
        <Table.Row>
            <Table.Header>3</Table.Header>
            <Table.Data>Larry</Table.Data>
            <Table.Data>the Bird</Table.Data>
            <Table.Data isActive>@twitter</Table.Data>
        </Table.Row>
    </Table.Body>
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="table-border-example">
        <h2 class="wk-quick-link mb-3">Table Border Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Default Example</h4>
                <div class="mb-3">
                    <Table.Root isBordered>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBordered>
    ...
</Table.Root>`} />
                <h4 class="my-3">Border Color Example</h4>
                <div class="mb-3">
                    <Table.Root borderColorVariant="border-primary" isBordered>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root borderColorVariant="border-primary" isBordered>
    ...
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="table-without-borders-example">
        <h2 class="wk-quick-link mb-3">Table without Borders Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Default Example</h4>
                <div class="mb-3">
                    <Table.Root isBorderless>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBorderless>
    ...
</Table.Root>`} />

                <h4 class="my-3">Dark Example</h4>
                <div class="mb-3">
                    <Table.Root colorVariant="dark" isBorderless>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root colorVariant="dark" isBorderless>
    ...
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="small-tables-example">
        <h2 class="wk-quick-link mb-3">Small Tables Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Default Example</h4>
                <div class="mb-3">
                    <Table.Root size="sm">
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root size="sm">
    ...
</Table.Root>`} />
                <h4 class="my-3">Dark Example</h4>
                <div class="mb-3">
                    <Table.Root colorVariant="dark" size="sm">
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root colorVariant="dark" size="sm">
    ...
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="table-group-dividers-example">
        <h2 class="wk-quick-link mb-3">Table Group Dividers Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Table.Root>
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>#</Table.Header>
                                <Table.Header>First Name</Table.Header>
                                <Table.Header>Last Name</Table.Header>
                                <Table.Header>Username</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body hasGroupDivider>
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
                            <Table.Row>
                                <Table.Header>4</Table.Header>
                                <Table.Data>John</Table.Data>
                                <Table.Data>Doe</Table.Data>
                                <Table.Data>@johndoe</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root>
    <Table.Head>
        ...
    </Table.Head>
    <Table.Body hasGroupDivider>
        ...
    </Table.Body>
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="color-variant-example">
        <h2 class="wk-quick-link mb-3">Vertical Alignment Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <div class="table-responsive">
                        <Table.Root isResponsive verticalAlign="middle">
                            <Table.Head>
                                <Table.Row>
                                    <Table.Header class="w-25">Heading 1</Table.Header>
                                    <Table.Header class="w-25">Heading 2</Table.Header>
                                    <Table.Header class="w-25">Heading 3</Table.Header>
                                    <Table.Header class="w-25">Heading 4</Table.Header>
                                </Table.Row>
                            </Table.Head>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Data>This cell inherits <code>vertical-align: middle;</code> from the table</Table.Data>
                                    <Table.Data>This cell inherits <code>vertical-align: middle;</code> from the table</Table.Data>
                                    <Table.Data>This cell inherits <code>vertical-align: middle;</code> from the table</Table.Data>
                                    <Table.Data
                                        >This here is some placeholder text, intended to take up quite a bit of vertical space, to demonstrate how the
                                        vertical alignment works in the preceding cells.</Table.Data>
                                </Table.Row>
                                <Table.Row verticalAlign="bottom">
                                    <Table.Data>This cell inherits <code>vertical-align: bottom;</code> from the table row</Table.Data>
                                    <Table.Data>This cell inherits <code>vertical-align: bottom;</code> from the table row</Table.Data>
                                    <Table.Data>This cell inherits <code>vertical-align: bottom;</code> from the table row</Table.Data>
                                    <Table.Data
                                        >This here is some placeholder text, intended to take up quite a bit of vertical space, to demonstrate how the
                                        vertical alignment works in the preceding cells.</Table.Data>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Data>This cell inherits <code>vertical-align: middle;</code> from the table</Table.Data>
                                    <Table.Data>This cell inherits <code>vertical-align: middle;</code> from the table</Table.Data>
                                    <Table.Data verticalAlign="top">This cell is aligned to the top.</Table.Data>
                                    <Table.Data
                                        >This here is some placeholder text, intended to take up quite a bit of vertical space, to demonstrate how the
                                        vertical alignment works in the preceding cells.</Table.Data>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isResponsive verticalAlign="middle">
    <Table.Head>
        <Table.Row>
            ...
        </Table.Row>
    </Table.Head>
    <Table.Body>
        <Table.Row>
            ...
        </Table.Row>
        <Table.Row verticalAlign="bottom">
            ...
        </Table.Row>
        <Table.Row>
            <Table.Data>...</Table.Data>
            <Table.Data>...</Table.Data>
            <Table.Data verticalAlign="top">This cell is aligned to the top.</Table.Data>
            <Table.Data>...</Table.Data>
        </Table.Row>
    </Table.Body>
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="nesting-tables-example">
        <h2 class="wk-quick-link mb-3">Nesting Tables Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Table.Root isBordered isStriped>
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
                                <Table.Data colspan={4}>
                                    <Table.Root class="mb-0">
                                        <Table.Head>
                                            <Table.Row>
                                                <Table.Header>Header</Table.Header>
                                                <Table.Header>Header</Table.Header>
                                                <Table.Header>Header</Table.Header>
                                            </Table.Row>
                                        </Table.Head>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Header>A</Table.Header>
                                                <Table.Data>First</Table.Data>
                                                <Table.Data>Last</Table.Data>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Header>B</Table.Header>
                                                <Table.Data>First</Table.Data>
                                                <Table.Data>Last</Table.Data>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Header>C</Table.Header>
                                                <Table.Data>First</Table.Data>
                                                <Table.Data>Last</Table.Data>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table.Root>
                                </Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>3</Table.Header>
                                <Table.Data>John</Table.Data>
                                <Table.Data>Doe</Table.Data>
                                <Table.Data>@social</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBordered isStriped>
    <Table.Head>
        ...
    </Table.Head>
    <Table.Body>
        ...
        <Table.Row>
            <Table.Data colspan={4}>
                <Table.Root class="mb-0">
                    ...
                </Table.Root>
            </Table.Data>
        </Table.Row>
        ...
    </Table.Body>
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="table-head-color-scheme-example">
        <h2 class="wk-quick-link mb-3">Table Head Color Scheme Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Light Example</h4>
                <div class="mb-3">
                    <Table.Root>
                        <Table.Head colorScheme="light">
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root>
    <Table.Head colorScheme="light">
        ...
    </Table.Head>
    <Table.Body>
        ...
    </Table.Body>
</Table.Root>`} />
                <h4 class="my-3">Dark Example</h4>
                <div class="mb-3">
                    <Table.Root>
                        <Table.Head colorScheme="dark">
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root>
    <Table.Head colorScheme="dark">
        ...
    </Table.Head>
    <Table.Body>
        ...
    </Table.Body>
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="table-foot-example">
        <h2 class="wk-quick-link mb-3">Table Foot Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Table.Root>
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
                        <Table.Foot>
                            <Table.Row>
                                <Table.Header>Total</Table.Header>
                                <Table.Data colspan={3}>3</Table.Data>
                            </Table.Row>
                        </Table.Foot>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root>
    <Table.Head>
        ...
    </Table.Head>
    <Table.Body>
        ...
    </Table.Body>
    <Table.Foot>
        <Table.Row>
            <Table.Header>Total</Table.Header>
            <Table.Data colspan={3}>3</Table.Data>
        </Table.Row>
    </Table.Foot>
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="captions-example">
        <h2 class="wk-quick-link mb-3">Captions Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Default Example</h4>
                <div class="mb-3">
                    <Table.Root size="sm">
                        <Table.Caption>List of users</Table.Caption>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root>
    <Table.Caption>List of users</Table.Caption>
    <Table.Head>
        ...
    </Table.Head>
    <Table.Body>
        ...
    </Table.Body>
    <Table.Foot>
        ...
    </Table.Foot>
</Table.Root>`} />
                <h4 class="my-3">Top Example</h4>
                <div class="mb-3">
                    <Table.Root isCaptionTop size="sm">
                        <Table.Caption>List of users</Table.Caption>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isCaptionTop size="sm">
    <Table.Caption>List of users</Table.Caption>
    <Table.Head>
        ...
    </Table.Head>
    <Table.Body>
        ...
    </Table.Body>
    <Table.Foot>
        ...
    </Table.Foot>
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="responsive-example">
        <h2 class="wk-quick-link mb-3">Responsive Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <h4 class="mb-3">Always Responsive Example</h4>
                <div class="mb-3">
                    <Table.Root isBordered isResponsive>
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>#</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Header>1</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>2</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>3</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBordered isResponsive>
    ...
</Table.Root>`} />
                <h4 class="my-3">Breakpoint Small Example</h4>
                <div class="mb-3">
                    <Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'sm' }}>
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>#</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Header>1</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>2</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>3</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'sm' }}>
    ...
</Table.Root>`} />
                <h4 class="my-3">Breakpoint Medium Example</h4>
                <div class="mb-3">
                    <Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'md' }}>
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>#</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Header>1</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>2</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>3</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'md' }}>
    ...
</Table.Root>`} />
                <h4 class="my-3">Breakpoint Large Example</h4>
                <div class="mb-3">
                    <Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'lg' }}>
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>#</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Header>1</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>2</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>3</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'lg' }}>
    ...
</Table.Root>`} />
                <h4 class="my-3">Breakpoint Extra Large Example</h4>
                <div class="mb-3">
                    <Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'xl' }}>
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>#</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Header>1</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>2</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>3</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'xl' }}>
    ...
</Table.Root>`} />
                <h4 class="my-3">Breakpoint Extra Extra Large Example</h4>
                <div class="mb-3">
                    <Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'xxl' }}>
                        <Table.Head>
                            <Table.Row>
                                <Table.Header>#</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                                <Table.Header>Heading</Table.Header>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Header>1</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>2</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                            <Table.Row>
                                <Table.Header>3</Table.Header>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                                <Table.Data>Cell</Table.Data>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'xxl' }}>
    ...
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="table-container-footer-example">
        <h2 class="wk-quick-link mb-3">Table Container Footer Example</h2>
        <p>
            You can use the <code>tableContainerFooter</code> snippet prop to render content directly after the table or responsive wrapper. This is useful
            for adding pagination controls, action buttons, or other footer elements that should appear with the table.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'md' }}>
                        {#snippet tableContainerFooter()}
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <div class="text-muted">Showing 1 to 3 of 3 entries</div>
                                <Pagination.Root size="sm">
                                    <Pagination.Item isDisabled={true}>
                                        <Pagination.Link href="#!" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                        </Pagination.Link>
                                    </Pagination.Item>
                                    <Pagination.Item isActive={true}>
                                        <Pagination.Link href="#!">1</Pagination.Link>
                                    </Pagination.Item>
                                    <Pagination.Item>
                                        <Pagination.Link href="#!">2</Pagination.Link>
                                    </Pagination.Item>
                                    <Pagination.Item>
                                        <Pagination.Link href="#!">3</Pagination.Link>
                                    </Pagination.Item>
                                    <Pagination.Item>
                                        <Pagination.Link href="#!" aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                        </Pagination.Link>
                                    </Pagination.Item>
                                </Pagination.Root>
                            </div>
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
                </div>
                <SyntaxHighlighter
                    code={`<Table.Root isBordered isResponsive responsiveProps={{ breakpoint: 'md' }}>
    {#snippet tableContainerFooter()}
        <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="text-muted">
                Showing 1 to 3 of 3 entries
            </div>
            <Pagination.Root size="sm">
                <Pagination.Item isDisabled={true}>
                    <Pagination.Link href="#!" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </Pagination.Link>
                </Pagination.Item>
                <Pagination.Item isActive={true}>
                    <Pagination.Link href="#!">1</Pagination.Link>
                </Pagination.Item>
                <Pagination.Item>
                    <Pagination.Link href="#!">2</Pagination.Link>
                </Pagination.Item>
                <Pagination.Item>
                    <Pagination.Link href="#!">3</Pagination.Link>
                </Pagination.Item>
                <Pagination.Item>
                    <Pagination.Link href="#!" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </Pagination.Link>
                </Pagination.Item>
            </Pagination.Root>
        </div>
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
</Table.Root>`} />
            </div>
        </div>
    </section>

    <section class="mb-4" id="css-classes-reference">
        <h2 class="wk-quick-link mb-3">Table CSS Classes & Usage</h2>
        <p>
            This section documents all CSS classes that can appear on the rendered Table component markup. Understanding these classes helps when
            customizing styles or debugging layout issues.
        </p>

        <div class="card mb-4">
            <div class="card-body">
                <h3 class="h5">Table Element Classes</h3>
                <p class="text-muted">Classes applied to the <code>&lt;table&gt;</code> element</p>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Class Name</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>table</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>Base class required on all tables. Provides default table styling.</td>
                            </tr>
                            <tr>
                                <td><code>table-striped</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td
                                    >Adds zebra-striping to table rows within <code>&lt;tbody&gt;</code>. Controlled by <code>isStriped</code> prop.</td>
                            </tr>
                            <tr>
                                <td><code>table-striped-columns</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>Adds zebra-striping to table columns. Controlled by <code>isStripedColumns</code> prop.</td>
                            </tr>
                            <tr>
                                <td><code>table-hover</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td
                                    >Enables hover state on table rows within <code>&lt;tbody&gt;</code>. Controlled by <code>isHoverable</code> prop.</td>
                            </tr>
                            <tr>
                                <td><code>table-bordered</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>Adds borders on all sides of the table and cells. Controlled by <code>isBordered</code> prop.</td>
                            </tr>
                            <tr>
                                <td><code>table-borderless</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>Removes all borders from the table. Controlled by <code>isBorderless</code> prop.</td>
                            </tr>
                            <tr>
                                <td><code>table-sm</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>Makes the table more compact by cutting cell padding in half. Controlled by <code>size="sm"</code> prop.</td>
                            </tr>
                            <tr>
                                <td><code>table-&#123;variant&#125;</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td
                                    >Applies contextual color to the entire table. Options: <code>primary</code>, <code>secondary</code>,
                                    <code>success</code>, <code>danger</code>, <code>warning</code>, <code>info</code>, <code>light</code>,
                                    <code>dark</code>. Controlled by <code>colorVariant</code> prop.</td>
                            </tr>
                            <tr>
                                <td><code>align-&#123;position&#125;</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td
                                    >Sets vertical alignment for all cells in the table. Options: <code>top</code>, <code>middle</code>,
                                    <code>bottom</code>. Controlled by <code>verticalAlign</code> prop on Table.Root.</td>
                            </tr>
                            <tr>
                                <td><code>caption-top</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>Places the table caption at the top instead of the bottom. Controlled by <code>isCaptionTop</code> prop.</td>
                            </tr>
                            <tr>
                                <td><code>border-&#123;color&#125;</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td
                                    >Changes border color when used with <code>table-bordered</code>. Examples: <code>border-primary</code>,
                                    <code>border-secondary</code>. Controlled by <code>borderColorVariant</code> prop.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <h3 class="h5">Container & Wrapper Classes</h3>
                <p class="text-muted">Classes applied to wrapper elements around the table</p>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Class Name</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>table-container</code></td>
                                <td><span class="badge bg-success">Custom</span></td>
                                <td>
                                    Custom wrapper class that always wraps the table. Safe to target in your CSS for custom styling or layout
                                    adjustments. Can be extended via <code>containerProps=&#123;&#123; class: 'your-class' &#125;&#125;</code>.
                                </td>
                            </tr>
                            <tr>
                                <td><code>table-responsive</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td
                                    >Makes table responsive across all breakpoints. Wraps the table in a scrollable container. Controlled by <code
                                        >isResponsive</code> prop without specifying a breakpoint.</td>
                            </tr>
                            <tr>
                                <td><code>table-responsive-&#123;breakpoint&#125;</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>
                                    Makes table responsive up to a specific breakpoint. Options: <code>sm</code>, <code>md</code>, <code>lg</code>,
                                    <code>xl</code>, <code>xxl</code>. Controlled by
                                    <code>responsiveProps=&#123;&#123; breakpoint: 'md' &#125;&#125;</code>.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <h3 class="h5">Row & Cell Classes</h3>
                <p class="text-muted">Classes applied to <code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code>, and <code>&lt;td&gt;</code> elements</p>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Class Name</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>table-active</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td
                                    >Highlights a row or cell with an active/selected state. Can be applied to Table.Row or Table.Data via <code
                                        >isActive</code> prop.</td>
                            </tr>
                            <tr>
                                <td><code>table-&#123;variant&#125;</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>
                                    Applies contextual color to individual rows or cells. Same variant options as table-level variants. Controlled by <code
                                        >colorVariant</code> prop on Table.Row or Table.Data.
                                </td>
                            </tr>
                            <tr>
                                <td><code>align-&#123;position&#125;</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>
                                    Sets vertical alignment for a specific row or cell. Options: <code>top</code>, <code>middle</code>,
                                    <code>bottom</code>. Controlled by <code>verticalAlign</code> prop on Table.Row or Table.Data.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <h3 class="h5">Table Section Classes</h3>
                <p class="text-muted">
                    Classes applied to <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, and <code>&lt;tfoot&gt;</code> elements
                </p>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Class Name</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>table-light</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>Applies light background to table head. Controlled by <code>colorScheme="light"</code> prop on Table.Head.</td>
                            </tr>
                            <tr>
                                <td><code>table-dark</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>Applies dark background to table head. Controlled by <code>colorScheme="dark"</code> prop on Table.Head.</td>
                            </tr>
                            <tr>
                                <td><code>table-group-divider</code></td>
                                <td><span class="badge bg-primary">Bootstrap v5</span></td>
                                <td>
                                    Adds a thicker border above the table section to visually separate groups. Controlled by <code
                                        >hasGroupDivider</code> prop on Table.Body or Table.Foot.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h3 class="h5">Customization Guidelines</h3>
                <p>When extending or overriding table styles in your own CSS:</p>
                <ul>
                    <li>
                        <strong>Safe to override:</strong> The <code>table-container</code> class is custom and designed to be targeted for layout
                        customizations (e.g., adding margins, max-width, shadows). You can also pass additional classes via
                        <code>containerProps</code>.
                    </li>
                    <li>
                        <strong>Bootstrap classes:</strong> All classes prefixed with <code>table-</code>, <code>align-</code>,
                        <code>caption-top</code>, and <code>border-</code>
                        are from Bootstrap v5. Overriding these may affect Bootstrap's default behavior. Prefer using Bootstrap's utility classes or variants
                        when possible.
                    </li>
                    <li>
                        <strong>Responsive wrappers:</strong> The <code>table-responsive</code> and
                        <code>table-responsive-&#123;breakpoint&#125;</code> classes add overflow scrolling. Override with caution to avoid breaking responsive
                        behavior on mobile devices.
                    </li>
                    <li>
                        <strong>Custom classes:</strong> You can always add your own classes via the <code>class</code> prop on any Table component
                        (e.g., <code>Table.Root class="my-custom-table"</code>). These will be merged with the Bootstrap classes.
                    </li>
                    <li>
                        <strong>Theming:</strong> For global table styling, consider creating a custom Bootstrap theme or using CSS variables to adjust
                        colors, spacing, and borders across all tables.
                    </li>
                </ul>
            </div>
        </div>
    </section>
</div>
