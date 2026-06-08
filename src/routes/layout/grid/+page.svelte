<script lang="ts">
    import { Col, Container, Row } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
</script>

<div class="wk-grid-content">
    <div class="mb-4">
        <h1>Grid</h1>
        <p class="lead">
            Use the powerful mobile-first flexbox grid to build layouts of all shapes and sizes thanks to a twelve column system, six default
            responsive tiers, Sass variables and mixins, and dozens of predefined classes.
        </p>
        <p>
            The following examples replicate each of the examples from the Bootstrap documentation: <a
                href="https://getbootstrap.com/docs/5.3/layout/grid/"
                target="_blank">https://getbootstrap.com/docs/5.3/layout/grid/</a>
        </p>
        <hr />
    </div>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Basic Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Equal-width</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col>1 of 2</Col>
                            <Col>2 of 2</Col>
                        </Row>
                        <Row>
                            <Col>1 of 3</Col>
                            <Col>2 of 3</Col>
                            <Col>3 of 3</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col>1 of 2</Col>
        <Col>2 of 2</Col>
    </Row>
    <Row>
        <Col>1 of 3</Col>
        <Col>2 of 3</Col>
        <Col>3 of 3</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Setting one column width</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col>1 of 3</Col>
                            <Col sizing={6}>2 of 3 (wider)</Col>
                            <Col>3 of 3</Col>
                        </Row>
                        <Row>
                            <Col>1 of 3</Col>
                            <Col sizing={5}>2 of 3 (wider)</Col>
                            <Col>3 of 3</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col>1 of 3</Col>
        <Col sizing={6}>2 of 3 (wider)</Col>
        <Col>3 of 3</Col>
    </Row>
    <Row>
        <Col>1 of 3</Col>
        <Col sizing={5}>2 of 3 (wider)</Col>
        <Col>3 of 3</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Variable width content</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row class="justify-content-md-center">
                            <Col sizing={{ lg: 2 }}>1 of 3</Col>
                            <Col sizing={{ md: 'auto' }}>Variable width content</Col>
                            <Col sizing={{ lg: 2 }}>3 of 3</Col>
                        </Row>
                        <Row>
                            <Col>1 of 3</Col>
                            <Col sizing={{ md: 'auto' }}>Variable width content</Col>
                            <Col sizing={{ lg: 2 }}>3 of 3</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row class="justify-content-md-center">
        <Col sizing={{ lg: 2 }}>1 of 3</Col>
        <Col sizing={{ md: 'auto' }}>Variable width content</Col>
        <Col sizing={{ lg: 2 }}>3 of 3</Col>
    </Row>
    <Row>
        <Col>1 of 3</Col>
        <Col sizing={{ md: 'auto' }}>Variable width content</Col>
        <Col sizing={{ lg: 2 }}>3 of 3</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">All breakpoints</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col>col</Col>
                            <Col>col</Col>
                            <Col>col</Col>
                            <Col>col</Col>
                        </Row>
                        <Row>
                            <Col sizing={8}>col-8</Col>
                            <Col sizing={4}>col-4</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col>col</Col>
        <Col>col</Col>
        <Col>col</Col>
        <Col>col</Col>
    </Row>
    <Row>
        <Col sizing={8}>col-8</Col>
        <Col sizing={4}>col-4</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Stacked to horizontal</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col sizing={{ sm: 8 }}>col-sm-8</Col>
                            <Col sizing={{ sm: 4 }}>col-sm-4</Col>
                        </Row>
                        <Row>
                            <Col sizing={{ sm: '*' }}>col-sm</Col>
                            <Col sizing={{ sm: '*' }}>col-sm</Col>
                            <Col sizing={{ sm: '*' }}>col-sm</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col sizing={{ sm: 8 }}>col-sm-8</Col>
        <Col sizing={{ sm: 4 }}>col-sm-4</Col>
    </Row>
    <Row>
        <Col sizing={{ sm: '*' }}>col-sm</Col>
        <Col sizing={{ sm: '*' }}>col-sm</Col>
        <Col sizing={{ sm: '*' }}>col-sm</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Mix and match</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <!-- Stack the columns on mobile by making one full-width and the other half-width -->
                        <Row>
                            <Col sizing={{ md: 8 }}>col-md-8</Col>
                            <Col sizing={{ xs: 6, md: 4 }}>col-6 .col-md-4</Col>
                        </Row>

                        <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
                        <Row>
                            <Col sizing={{ xs: 6, md: 4 }}>col-6 .col-md-4</Col>
                            <Col sizing={{ xs: 6, md: 4 }}>col-6 .col-md-4</Col>
                            <Col sizing={{ xs: 6, md: 4 }}>col-6 .col-md-4</Col>
                        </Row>

                        <!-- Columns are always 50% wide, on mobile and desktop -->
                        <Row>
                            <Col sizing={6}>col-6</Col>
                            <Col sizing={6}>col-6</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <!-- Stack the columns on mobile by making one full-width and the other half-width -->
    <Row>
        <Col sizing={{ md: 8 }}>col-md-8</Col>
        <Col sizing={{ xs: 6, md: 4 }}>col-6 .col-md-4</Col>
    </Row>

    <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
    <Row>
        <Col sizing={{ xs: 6, md: 4 }}>col-6 .col-md-4</Col>
        <Col sizing={{ xs: 6, md: 4 }}>col-6 .col-md-4</Col>
        <Col sizing={{ xs: 6, md: 4 }}>col-6 .col-md-4</Col>
    </Row>

    <!-- Columns are always 50% wide, on mobile and desktop -->
    <Row>
        <Col sizing={6}>col-6</Col>
        <Col sizing={6}>col-6</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Row columns</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row cols={2}>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row cols={2}>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row cols={3}>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row cols={3}>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row cols="auto">
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row cols="auto">
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row cols={4}>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row cols={4}>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row cols={4}>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col sizing={6}>Column</Col>
                            <Col>Column</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row cols={4}>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col sizing={6}>Column</Col>
        <Col>Column</Col>
    </Row>
</Container>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row cols={{ xs: 1, sm: 2, md: 4 }}>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                            <Col>Column</Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row cols={{ xs: 1, sm: 2, md: 4 }}>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Nesting</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Container class="text-center">
                        <Row>
                            <Col sizing={{ sm: 3 }}>Level 1: .col-sm-3</Col>
                            <Col sizing={{ sm: 9 }}>
                                <Row>
                                    <Col sizing={{ xs: 8, sm: 6 }}>Level 2: .col-8 .col-sm-6</Col>
                                    <Col sizing={{ xs: 4, sm: 6 }}>Level 2: .col-4 .col-sm-6</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <SyntaxHighlighter
                    code={`<Container class="text-center">
    <Row>
        <Col sizing={{ sm: 3 }}>Level 1: .col-sm-3</Col>
        <Col sizing={{ sm: 9 }}>
            <Row>
                <Col sizing={{ xs: 8, sm: 6 }}>Level 2: .col-8 .col-sm-6</Col>
                <Col sizing={{ xs: 4, sm: 6 }}>Level 2: .col-4 .col-sm-6</Col>
            </Row>
        </Col>
    </Row>
</Container>`} />
            </div>
        </div>
    </section>
</div>

<style global>
    .wk-grid-content [class^='col'],
    .wk-grid-content [class^='col'] > * {
        --bd-violet-rgb: 113, 44, 249;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        background-color: rgba(var(--bd-violet-rgb), 0.15);
        border: 1px solid rgba(var(--bd-violet-rgb), 0.3);
    }
    .wk-grid-content [class^='row'] {
        margin-bottom: 0.75rem;
    }
</style>
