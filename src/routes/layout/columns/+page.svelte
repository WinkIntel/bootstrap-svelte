<script lang="ts">
    import Container from '$lib/Container/container.svelte';
    import { Col } from '$lib/index.js';
    import Row from '$lib/Row/row.svelte';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
</script>

<div class="wk-columns-content">
    <div class="mb-4">
        <h1>Columns</h1>
        <p class="lead">
            Learn how to modify columns with a handful of options for alignment, ordering, and offsetting thanks to our flexbox grid system. Plus, see
            how to use column classes to manage widths of non-grid elements.
        </p>
        <p>
            The following examples replicate each of the examples from the Bootstrap documentation: <a
                href="https://getbootstrap.com/docs/5.3/layout/columns/"
                target="_blank">https://getbootstrap.com/docs/5.3/layout/columns/</a>
        </p>
        <hr />
    </div>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Vertical alignment</h2>
        <div class="card mb-3">
            <div class="card-body v-alignment-content">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row class="align-items-start">
                            <Col>One of three columns</Col>
                            <Col>One of three columns</Col>
                            <Col>One of three columns</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row class="align-items-start">
        <Col>One of three columns</Col>
        <Col>One of three columns</Col>
        <Col>One of three columns</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body v-alignment-content">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row class="align-items-center">
                            <Col>One of three columns</Col>
                            <Col>One of three columns</Col>
                            <Col>One of three columns</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row class="align-items-center">
        <Col>One of three columns</Col>
        <Col>One of three columns</Col>
        <Col>One of three columns</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body v-alignment-content">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row class="align-items-end">
                            <Col>One of three columns</Col>
                            <Col>One of three columns</Col>
                            <Col>One of three columns</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row class="align-items-end">
        <Col>One of three columns</Col>
        <Col>One of three columns</Col>
        <Col>One of three columns</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body v-alignment-content">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col class="align-self-start">One of three columns</Col>
                            <Col class="align-self-center">One of three columns</Col>
                            <Col class="align-self-end">One of three columns</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col class="align-self-start">One of three columns</Col>
        <Col class="align-self-center">One of three columns</Col>
        <Col class="align-self-end">One of three columns</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Horizontal alignment</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row class="justify-content-start">
                            <Col sizing={4}>One of two columns</Col>
                            <Col sizing={4}>One of two columns</Col>
                        </Row>
                        <Row class="justify-content-center">
                            <Col sizing={4}>One of two columns</Col>
                            <Col sizing={4}>One of two columns</Col>
                        </Row>
                        <Row class="justify-content-end">
                            <Col sizing={4}>One of two columns</Col>
                            <Col sizing={4}>One of two columns</Col>
                        </Row>
                        <Row class="justify-content-around">
                            <Col sizing={4}>One of two columns</Col>
                            <Col sizing={4}>One of two columns</Col>
                        </Row>
                        <Row class="justify-content-between">
                            <Col sizing={4}>One of two columns</Col>
                            <Col sizing={4}>One of two columns</Col>
                        </Row>
                        <Row class="justify-content-evenly">
                            <Col sizing={4}>One of two columns</Col>
                            <Col sizing={4}>One of two columns</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row class="justify-content-start">
        <Col sizing={4}>One of two columns</Col>
        <Col sizing={4}>One of two columns</Col>
    </Row>
    <Row class="justify-content-center">
        <Col sizing={4}>One of two columns</Col>
        <Col sizing={4}>One of two columns</Col>
    </Row>
    <Row class="justify-content-end">
        <Col sizing={4}>One of two columns</Col>
        <Col sizing={4}>One of two columns</Col>
    </Row>
    <Row class="justify-content-around">
        <Col sizing={4}>One of two columns</Col>
        <Col sizing={4}>One of two columns</Col>
    </Row>
    <Row class="justify-content-between">
        <Col sizing={4}>One of two columns</Col>
        <Col sizing={4}>One of two columns</Col>
    </Row>
    <Row class="justify-content-evenly">
        <Col sizing={4}>One of two columns</Col>
        <Col sizing={4}>One of two columns</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Column wrapping</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container>
                        <Row>
                            <Col sizing={9}>.col-9</Col>
                            <Col sizing={4}
                                >.col-4<br />Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.</Col>
                            <Col sizing={6}>.col-6<br />Subsequent columns continue along the new line.</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container>
    <Row>
        <Col sizing={9}>.col-9</Col>
        <Col sizing={4}>
            .col-4<br />Since 9 + 4 = 13 &gt; 12, this 4-column-wide
            div gets wrapped onto a new line as one contiguous unit.
        </Col>
        <Col sizing={6}>
            .col-6<br />Subsequent columns continue along the new line.
        </Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Column breaks</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col sizing={{ xs: 6, sm: 3 }}>.col-6 .col-sm-3</Col>
                            <Col sizing={{ xs: 6, sm: 3 }}>.col-6 .col-sm-3</Col>

                            <!-- Force next columns to break to new line -->
                            <div class="w-100"></div>

                            <Col sizing={{ xs: 6, sm: 3 }}>.col-6 .col-sm-3</Col>
                            <Col sizing={{ xs: 6, sm: 3 }}>.col-6 .col-sm-3</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col sizing={{ xs: 6, sm: 3 }}>.col-6 .col-sm-3</Col>
        <Col sizing={{ xs: 6, sm: 3 }}>.col-6 .col-sm-3</Col>

        <!-- Force next columns to break to new line -->
        <div class="w-100"></div>

        <Col sizing={{ xs: 6, sm: 3 }}>.col-6 .col-sm-3</Col>
        <Col sizing={{ xs: 6, sm: 3 }}>.col-6 .col-sm-3</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col sizing={{ xs: 6, sm: 4 }}>.col-6 .col-sm-4</Col>
                            <Col sizing={{ xs: 6, sm: 4 }}>.col-6 .col-sm-4</Col>

                            <!-- Force next columns to break to new line at md breakpoint and up -->
                            <div class="w-100 d-none d-md-block"></div>

                            <Col sizing={{ xs: 6, sm: 4 }}>.col-6 .col-sm-4</Col>
                            <Col sizing={{ xs: 6, sm: 4 }}>.col-6 .col-sm-4</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col sizing={{ xs: 6, sm: 4 }}>.col-6 .col-sm-4</Col>
        <Col sizing={{ xs: 6, sm: 4 }}>.col-6 .col-sm-4</Col>

        <!-- Force next columns to break to new line
             at md breakpoint and up -->
        <div class="w-100 d-none d-md-block"></div>

        <Col sizing={{ xs: 6, sm: 4 }}>.col-6 .col-sm-4</Col>
        <Col sizing={{ xs: 6, sm: 4 }}>.col-6 .col-sm-4</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Order classes</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col>First in DOM, no order applied</Col>
                            <Col order={5}>Second in DOM, with a larger order</Col>
                            <Col order={1}>Third in DOM, with an order of 1</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col>First in DOM, no order applied</Col>
        <Col order={5}>Second in DOM, with a larger order</Col>
        <Col order={1}>Third in DOM, with an order of 1</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col order="last">First in DOM, ordered last</Col>
                            <Col>Second in DOM, unordered</Col>
                            <Col order="first">Third in DOM, ordered first</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col order={'last'}>First in DOM, ordered last</Col>
        <Col>Second in DOM, unordered</Col>
        <Col order={'first'}>Third in DOM, ordered first</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Offset classes</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col sizing={{ md: 4 }}>.col-md-4</Col>
                            <Col sizing={{ md: 4 }} offset={{ md: 4 }}>.col-md-4 .offset-md-4</Col>
                        </Row>
                        <Row>
                            <Col sizing={{ md: 3 }} offset={{ md: 3 }}>.col-md-3 .offset-md-3</Col>
                            <Col sizing={{ md: 3 }} offset={{ md: 3 }}>.col-md-3 .offset-md-3</Col>
                        </Row>
                        <Row>
                            <Col sizing={{ md: 6 }} offset={{ md: 3 }}>.col-md-6 .offset-md-3</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col sizing={{ md: 4 }}>
            .col-md-4
        </Col>
        <Col sizing={{ md: 4 }} offset={{ md: 4 }}>
            .col-md-4 .offset-md-4
        </Col>
    </Row>
    <Row>
        <Col sizing={{ md: 3 }} offset={{ md: 3 }}>
            .col-md-3 .offset-md-3
        </Col>
        <Col sizing={{ md: 3 }} offset={{ md: 3 }}>
            .col-md-3 .offset-md-3
        </Col>
    </Row>
    <Row>
        <Col sizing={{ md: 6 }} offset={{ md: 3 }}>
            .col-md-6 .offset-md-3
        </Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col sizing={{ sm: 5, md: 6 }}>.col-sm-5 .col-md-6</Col>
                            <Col sizing={{ sm: 5, md: 6 }} offset={{ sm: 2, md: 0 }}>.col-sm-5 .offset-sm-2 .col-md-6 .offset-md-0</Col>
                        </Row>
                        <Row>
                            <Col sizing={{ sm: 6, md: 5, lg: 6 }}>.col-sm-6 .col-md-5 .col-lg-6</Col>
                            <Col sizing={{ sm: 6, md: 5, lg: 6 }} offset={{ md: 2, lg: 0 }}>
                                .col-sm-6 .col-md-5 .offset-md-2 .col-lg-6 .offset-lg-0</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col sizing={{ sm: 5, md: 6 }}>
            .col-sm-5 .col-md-6
        </Col>
        <Col sizing={{ sm: 5, md: 6 }} offset={{ sm: 2, md: 0 }}>
            .col-sm-5 .offset-sm-2 .col-md-6 .offset-md-0
        </Col>
    </Row>
    <Row>
        <Col sizing={{ sm: 6, md: 5, lg: 6 }}>
            .col-sm-6 .col-md-5 .col-lg-6
        </Col>
        <Col sizing={{ sm: 6, md: 5, lg: 6 }} offset={{ md: 2, lg: 0 }}>
            .col-sm-6 .col-md-5 .offset-md-2 .col-lg-6 .offset-lg-0
        </Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Margin utilities</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col sizing={{ md: 4 }}>.col-md-4</Col>
                            <Col sizing={{ md: 4 }} class="ms-auto">.col-md-4 .ms-auto</Col>
                        </Row>
                        <Row>
                            <Col sizing={{ md: 3 }} class="ms-md-auto">.col-md-3 .ms-md-auto</Col>
                            <Col sizing={{ md: 3 }} class="ms-md-auto">.col-md-3 .ms-md-auto</Col>
                        </Row>
                        <Row>
                            <Col sizing="auto" class="me-auto">.col-auto .me-auto</Col>
                            <Col sizing="auto">.col-auto</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col sizing={{ md: 4 }}>.col-md-4</Col>
        <Col sizing={{ md: 4 }} class="ms-auto">
            .col-md-4 .ms-auto
        </Col>
    </Row>
    <Row>
        <Col sizing={{ md: 3 }} class="ms-md-auto">
            .col-md-3 .ms-md-auto
        </Col>
        <Col sizing={{ md: 3 }} class="ms-md-auto">
            .col-md-3 .ms-md-auto
        </Col>
    </Row>
    <Row>
        <Col sizing="auto" class="me-auto">
            .col-auto .me-auto
        </Col>
        <Col sizing="auto">.col-auto</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Standalone column classes</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Col sizing={{ sm: 3 }} class="p-3 mb-2">.col-3: width of 25%</Col>

                    <Col sizing={{ sm: 9 }} class="p-3">.col-sm-9: width of 75% above sm breakpoint</Col>
                </div>
                <SyntaxHighlighter
                    code={`<Col sizing={{ sm: 3 }} class="p-3 mb-2">
    .col-3: width of 25%
</Col>

<Col sizing={{ sm: 9 }} class="p-3">
    .col-sm-9: width of 75% above sm breakpoint
</Col>`} />
            </div>
        </div>
    </section>
</div>

<style global>
    .wk-columns-content [class^='col'],
    .wk-columns-content [class^='col'] > * {
        --bd-violet-rgb: 113, 44, 249;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        background-color: rgba(var(--bd-violet-rgb), 0.15);
        border: 1px solid rgba(var(--bd-violet-rgb), 0.3);
    }
    .wk-columns-content [class^='row'] {
        margin-bottom: 0.75rem;
    }
    .wk-columns-content .v-alignment-content [class^='row'] {
        --bd-violet-rgb: 113, 44, 249;
        background-color: rgba(var(--bd-violet-rgb), 0.15);
        min-height: 10rem;
    }
</style>
