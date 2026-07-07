<script lang="ts">
    import { Container, Nav, Navbar, Offcanvas } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import NavbarPlayground from './NavbarPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Navbar</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
    <Navbar.Collapse id="navbarSupportedContent">
      <Navbar.Nav class="me-auto mb-2 mb-lg-0">
        <Nav.Item>
          <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link isDisabled={true} href="#navbar-demo-link">Disabled</Nav.Link>
        </Nav.Item>
      </Navbar.Nav>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" name="search" placeholder="Search" aria-label="Search" />
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </Navbar.Collapse>
  </Container>
</Navbar.Root>`;

    const colorSchemesCode = `<!-- Dark theme navbar (dark background with light text) -->
<Navbar.Root expandOnBreakpoint="lg" class="bg-dark" data-bs-theme="dark">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Dark Navbar</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
    <Navbar.Collapse id="navbarDarkContent">
      <Navbar.Nav class="me-auto mb-2 mb-lg-0">
        <Nav.Item>
          <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Link</Nav.Link>
        </Nav.Item>
      </Navbar.Nav>
    </Navbar.Collapse>
  </Container>
</Navbar.Root>

<!-- Primary color navbar using class and data-bs-theme (legacy approach) -->
<Navbar.Root expandOnBreakpoint="lg" class="bg-primary" data-bs-theme="dark">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Primary Navbar</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
  </Container>
</Navbar.Root>

<!-- Primary color navbar using variant (recommended approach) -->
<Navbar.Root expandOnBreakpoint="lg" colorVariant="primary">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Primary Navbar with Variant</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
  </Container>
</Navbar.Root>`;

    const containersCode = `<!-- Default container (responsive fixed width) -->
<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
  <Container>
    <Navbar.Brand href="#navbar-demo-link">Default Container</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
  </Container>
</Navbar.Root>

<!-- Fluid container (full width) -->
<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Fluid Container</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
  </Container>
</Navbar.Root>

<!-- No container -->
<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
  <Navbar.Brand href="#navbar-demo-link" class="ms-3">No Container</Navbar.Brand>
  <Navbar.Toggler ariaLabel="Toggle navigation" class="me-3">
    <Navbar.TogglerIcon />
  </Navbar.Toggler>
</Navbar.Root>`;

    const placementCode = `<!-- Fixed top navbar -->
<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary" placement="fixed-top">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Fixed Top</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
  </Container>
</Navbar.Root>

<!-- Fixed bottom navbar -->
<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary" placement="fixed-bottom">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Fixed Bottom</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
  </Container>
</Navbar.Root>

<!-- Sticky top navbar -->
<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary" placement="sticky-top">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Sticky Top</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
  </Container>
</Navbar.Root>`;

    const scrollingCode = `<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Navbar Scroll</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
    <Navbar.Collapse id="navbarScroll">
      <Navbar.Nav class="me-auto mb-2 mb-lg-0" isVerticalScrolling={true} style="--bs-scroll-height: 100px;">
        <Nav.Item>
          <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Link 1</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Link 2</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Link 3</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Link 4</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Link 5</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Link 6</Nav.Link>
        </Nav.Item>
      </Navbar.Nav>
    </Navbar.Collapse>
  </Container>
</Navbar.Root>`;

    const offcanvasCode = `<Navbar.Root expandOnBreakpoint="xl" class="bg-body-tertiary">
    <Container isFluid={true}>
        <Navbar.Brand href="#navbar-demo-link">Navbar</Navbar.Brand>
        <Navbar.Toggler ariaLabel="Toggle navigation">
            <Navbar.TogglerIcon />
        </Navbar.Toggler>
        <Offcanvas.Root placement="end" useBackdrop={true}>
            <Offcanvas.Header isDismissible={true}>
                <Offcanvas.Title>Offcanvas in a Navbar</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Navbar.Nav class="justify-content-end flex-grow-1 pe-3">
                    <Nav.Item>
                        <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#navbar-demo-link">Link</Nav.Link>
                    </Nav.Item>
                </Navbar.Nav>
                <form class="d-flex mt-3" role="search">
                    <input class="form-control me-2" type="search" name="search" placeholder="Search" aria-label="Search" />
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </Offcanvas.Body>
        </Offcanvas.Root>
    </Container>
</Navbar.Root>`;

    const textCode = `<Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Navbar</Navbar.Brand>
    <Navbar.Text>
      Navbar text with an inline element
    </Navbar.Text>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
    <Navbar.Collapse id="navbarText">
      <Navbar.Nav class="me-auto mb-2 mb-lg-0">
        <Nav.Item>
          <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Features</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Pricing</Nav.Link>
        </Nav.Item>
      </Navbar.Nav>
      <Navbar.Text>
        Signed in as: <a href="#navbar-demo-link">Mark Otto</a>
      </Navbar.Text>
    </Navbar.Collapse>
  </Container>
</Navbar.Root>`;

    const variantExampleCode = `<!-- Using variant prop for automatic theme handling -->
<Navbar.Root expandOnBreakpoint="lg" colorVariant="primary">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Primary Navbar</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
    <Navbar.Collapse id="navbarVariantContent">
      <Navbar.Nav class="me-auto mb-2 mb-lg-0">
        <Nav.Item>
          <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#navbar-demo-link">Link</Nav.Link>
        </Nav.Item>
      </Navbar.Nav>
    </Navbar.Collapse>
  </Container>
</Navbar.Root>

<!-- Using variant prop with other colors -->
<Navbar.Root expandOnBreakpoint="lg" colorVariant="success">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Success Navbar</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
  </Container>
</Navbar.Root>

<!-- Light colored navbar with variant -->
<Navbar.Root expandOnBreakpoint="lg" colorVariant="light">
  <Container isFluid={true}>
    <Navbar.Brand href="#navbar-demo-link">Light Navbar</Navbar.Brand>
    <Navbar.Toggler ariaLabel="Toggle navigation">
      <Navbar.TogglerIcon />
    </Navbar.Toggler>
  </Container>
</Navbar.Root>`;
</script>

<div>
    <div class="mb-5">
        <h1>Navbar</h1>
        <span id="navbar-demo-link" class="visually-hidden">Navbar demo link target</span>
        <p class="lead">Bootstrap's powerful, responsive navigation header that includes support for branding, navigation, and more.</p>
        <hr />
    </div>

    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Navbar component by adjusting the props below:</p>
        <NavbarPlayground />
    </section>

    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>Here's a complete navbar example with branding, navigation, collapse support and search functionality:</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#navbar-demo-link">Navbar</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                            <Navbar.Collapse id="navbarBasicExample">
                                <Navbar.Nav class="me-auto mb-2 mb-lg-0">
                                    <Nav.Item>
                                        <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Link</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link isDisabled={true} href="#navbar-demo-link">Disabled</Nav.Link>
                                    </Nav.Item>
                                </Navbar.Nav>
                                <form class="d-flex" role="search">
                                    <input class="form-control me-2" type="search" name="search" placeholder="Search" aria-label="Search" />
                                    <button class="btn btn-outline-success" type="submit">Search</button>
                                </form>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar.Root>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="color-schemes">
        <h2 class="wk-quick-link">Color Schemes</h2>
        <p>
            Navbars can use various color schemes by combining Bootstrap background utilities with <code>data-bs-theme</code> attributes. You can use
            the new <code>colorVariant</code> prop to automatically apply the correct background color and text contrast.
        </p>
        <p>
            The <code>colorVariant</code> prop supports all Bootstrap background color variants and automatically sets the appropriate
            <code>data-bs-theme</code> attribute based on the background color to ensure proper text contrast as per
            <a href="https://getbootstrap.com/docs/5.3/helpers/color-background/#overview" target="_blank" rel="noopener">Bootstrap documentation</a>.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-column gap-3">
                    <Navbar.Root expandOnBreakpoint="lg" class="bg-dark" data-bs-theme="dark">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#navbar-demo-link">Dark Navbar</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                            <Navbar.Collapse id="navbarDarkExample">
                                <Navbar.Nav class="me-auto mb-2 mb-lg-0">
                                    <Nav.Item>
                                        <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Link</Nav.Link>
                                    </Nav.Item>
                                </Navbar.Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar.Root>

                    <Navbar.Root expandOnBreakpoint="lg" class="bg-primary" data-bs-theme="dark">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#navbar-demo-link">Primary Navbar</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                        </Container>
                    </Navbar.Root>
                </div>

                <SyntaxHighlighter code={colorSchemesCode} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="containers">
        <h2 class="wk-quick-link">Containers</h2>
        <p>
            Navbars can use various container options to control their horizontal width. Choose from a responsive fixed-width container (default) or a
            fluid-width container (full width).
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-column gap-3">
                    <div>
                        <small class="text-muted">Default container (responsive fixed width):</small>
                        <Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
                            <Container>
                                <Navbar.Brand href="#navbar-demo-link">Default Container</Navbar.Brand>
                                <Navbar.Toggler ariaLabel="Toggle navigation">
                                    <Navbar.TogglerIcon />
                                </Navbar.Toggler>
                            </Container>
                        </Navbar.Root>
                    </div>

                    <div>
                        <small class="text-muted">Fluid container (full width):</small>
                        <Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
                            <Container isFluid={true}>
                                <Navbar.Brand href="#navbar-demo-link">Fluid Container</Navbar.Brand>
                                <Navbar.Toggler ariaLabel="Toggle navigation">
                                    <Navbar.TogglerIcon />
                                </Navbar.Toggler>
                            </Container>
                        </Navbar.Root>
                    </div>

                    <div>
                        <small class="text-muted">No container:</small>
                        <Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
                            <Navbar.Brand href="#navbar-demo-link" class="ms-3">No Container</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation" class="me-3">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                        </Navbar.Root>
                    </div>
                </div>

                <SyntaxHighlighter code={containersCode} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="placement">
        <h2 class="wk-quick-link">Placement</h2>
        <p>Use the <code>placement</code> property to position navbars in different locations within your page.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <p>The following placement options are available:</p>
                    <ul>
                        <li><code>fixed-top</code> - Fixes the navbar at the top of the viewport</li>
                        <li><code>fixed-bottom</code> - Fixes the navbar at the bottom of the viewport</li>
                        <li><code>sticky-top</code> - Makes the navbar stick to the top when scrolling past it</li>
                        <li><code>sticky-bottom</code> - Makes the navbar stick to the bottom when scrolling past it</li>
                    </ul>

                    <div class="alert alert-info">These examples are not rendered here to avoid interfering with the page layout.</div>
                </div>

                <SyntaxHighlighter code={placementCode} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="scrolling">
        <h2 class="wk-quick-link">Scrolling</h2>
        <p>
            Add <code>isVerticalScrolling={true}</code> to a <code>Navbar.Nav</code> component to enable vertical scrolling within the toggleable contents
            of a collapsed navbar.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#navbar-demo-link">Navbar Scroll</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                            <Navbar.Collapse id="navbarScrollExample">
                                <Navbar.Nav class="me-auto mb-2 mb-lg-0" isVerticalScrolling={true} style="--bs-scroll-height: 100px;">
                                    <Nav.Item>
                                        <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Link 1</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Link 2</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Link 3</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Link 4</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Link 5</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Link 6</Nav.Link>
                                    </Nav.Item>
                                </Navbar.Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar.Root>
                </div>

                <SyntaxHighlighter code={scrollingCode} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="text">
        <h2 class="wk-quick-link">Text</h2>
        <p>
            Add non-navigational text to your navbar with <code>Navbar.Text</code> component.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Navbar.Root expandOnBreakpoint="lg" class="bg-body-tertiary">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#navbar-demo-link">Navbar</Navbar.Brand>
                            <Navbar.Text>Navbar text with an inline element</Navbar.Text>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                            <Navbar.Collapse id="navbarTextExample">
                                <Navbar.Nav class="me-auto mb-2 mb-lg-0">
                                    <Nav.Item>
                                        <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Features</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Pricing</Nav.Link>
                                    </Nav.Item>
                                </Navbar.Nav>
                                <Navbar.Text>
                                    Signed in as: <a href="#navbar-demo-link">Mark Otto</a>
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar.Root>
                </div>

                <SyntaxHighlighter code={textCode} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="variant">
        <h2 class="wk-quick-link">Variant</h2>
        <p>
            Use the <code>colorVariant</code> prop to apply predefined color themes to your navbar. This prop automatically handles the theme attributes
            for you.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-column gap-3">
                    <Navbar.Root expandOnBreakpoint="lg" colorVariant="primary">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#navbar-demo-link">Primary Navbar</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                            <Navbar.Collapse id="navbarVariantExample">
                                <Navbar.Nav class="me-auto mb-2 mb-lg-0">
                                    <Nav.Item>
                                        <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#navbar-demo-link">Link</Nav.Link>
                                    </Nav.Item>
                                </Navbar.Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar.Root>

                    <Navbar.Root expandOnBreakpoint="lg" colorVariant="success">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#navbar-demo-link">Success Navbar</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                        </Container>
                    </Navbar.Root>

                    <Navbar.Root expandOnBreakpoint="lg" colorVariant="light">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#navbar-demo-link">Light Navbar</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                        </Container>
                    </Navbar.Root>
                </div>

                <SyntaxHighlighter code={variantExampleCode} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="offcanvas">
        <h2 class="wk-quick-link">Offcanvas</h2>
        <p>Transform your navbar with an offcanvas component that displays navigation content when the navbar is collapsed or expanded.</p>
        <div class="alert alert-info">
            <strong>Responsive Behavior:</strong> The offcanvas content will automatically show when the navbar expands at the XL breakpoint, creating a
            seamless responsive navigation experience.
        </div>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Navbar.Root expandOnBreakpoint="xl" class="bg-body-tertiary">
                        <Container isFluid={true}>
                            <Navbar.Brand href="#navbar-demo-link">Navbar</Navbar.Brand>
                            <Navbar.Toggler ariaLabel="Toggle navigation">
                                <Navbar.TogglerIcon />
                            </Navbar.Toggler>
                            <Offcanvas.Root placement="end" useBackdrop={true}>
                                <Offcanvas.Header isDismissible={true}>
                                    <Offcanvas.Title>Offcanvas in a Navbar</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Navbar.Nav class="justify-content-end flex-grow-1 pe-3">
                                        <Nav.Item>
                                            <Nav.Link isActive={true} href="#navbar-demo-link">Home</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#navbar-demo-link">Link</Nav.Link>
                                        </Nav.Item>
                                    </Navbar.Nav>
                                    <form class="d-flex mt-3" role="search">
                                        <input class="form-control me-2" type="search" name="search" placeholder="Search" aria-label="Search" />
                                        <button class="btn btn-outline-success" type="submit">Search</button>
                                    </form>
                                </Offcanvas.Body>
                            </Offcanvas.Root>
                        </Container>
                    </Navbar.Root>
                </div>

                <SyntaxHighlighter code={offcanvasCode} />
            </div>
        </div>
    </section>

    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Navbar.Root Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>expandOnBreakpoint</code></td>
                        <td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'</code></td>
                        <td><code>'xs'</code></td>
                        <td>Breakpoint at which the navbar expands</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the navbar</td>
                    </tr>
                    <tr>
                        <td><code>placement</code></td>
                        <td><code>'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom'</code></td>
                        <td><code>undefined</code></td>
                        <td>Controls the positioning of the navbar within the page</td>
                    </tr>
                    <tr>
                        <td><code>colorVariant</code></td>
                        <td><code>'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'</code></td>
                        <td>-</td>
                        <td
                            >Background color variant for the navbar. Automatically applies the appropriate <code>data-bs-theme</code> attribute for proper
                            text contrast.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Navbar.Brand Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>href</code></td>
                        <td><code>string</code></td>
                        <td><code>'#!'</code></td>
                        <td>URL for the brand link</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the brand</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Navbar.Toggler Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>ariaLabel</code></td>
                        <td><code>string</code></td>
                        <td><code>'Toggle navigation'</code></td>
                        <td>Accessibility label for the toggler button</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the toggler</td>
                    </tr>
                    <tr>
                        <td><code>type</code></td>
                        <td><code>'button' | 'submit' | 'reset'</code></td>
                        <td><code>'button'</code></td>
                        <td>Button type attribute will be forced to 'button'</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Navbar.TogglerIcon Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Navbar.Collapse Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the collapse container (required for accessibility)</td>
                    </tr>
                    <tr>
                        <td><code>onCollapse</code></td>
                        <td><code>EventCallback</code></td>
                        <td>-</td>
                        <td>Callback when collapse starts</td>
                    </tr>
                    <tr>
                        <td><code>onCollapsed</code></td>
                        <td><code>EventCallback</code></td>
                        <td>-</td>
                        <td>Callback when collapse finishes</td>
                    </tr>
                    <tr>
                        <td><code>onExpand</code></td>
                        <td><code>EventCallback</code></td>
                        <td>-</td>
                        <td>Callback when expand starts</td>
                    </tr>
                    <tr>
                        <td><code>onExpanded</code></td>
                        <td><code>EventCallback</code></td>
                        <td>-</td>
                        <td>Callback when expand finishes</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Navbar.Nav Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the nav</td>
                    </tr>
                    <tr>
                        <td><code>isVerticalScrolling</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Enable vertical scrolling within the nav</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Navbar.Text Props</h3>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Additional CSS classes to apply to the component</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the DOM element</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td>Auto-generated</td>
                        <td>Unique identifier for the text</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's navbar classes based on the provided props:</p>
        <ul>
            <li><code>navbar</code> - Base class for the Navbar component</li>
            <li><code>navbar-expand-*</code> - Applied based on expandOnBreakpoint</li>
            <li><code>navbar-brand</code> - Applied to Navbar.Brand components</li>
            <li><code>navbar-nav</code> - Applied to Navbar.Nav components</li>
            <li><code>navbar-text</code> - Applied to Navbar.Text components</li>
            <li><code>navbar-toggler</code> - Applied to Navbar.Toggler components</li>
            <li><code>navbar-toggler-icon</code> - Applied to Navbar.TogglerIcon components</li>
            <li><code>navbar-collapse</code> - Applied to Navbar.Collapse components</li>
            <li><code>collapse</code> - Applied to Navbar.Collapse components</li>
            <li><code>navbar-scrolling</code> - Applied when isVerticalScrolling=true on Navbar.Nav</li>
        </ul>

        <h3 class="h5 mt-4">Responsive Behavior</h3>
        <p>Navbars are responsive by default:</p>
        <ul>
            <li>At smaller screen sizes (below the specified breakpoint), the navbar collapses and requires the toggler button to expand.</li>
            <li>At larger screen sizes (at or above the specified breakpoint), the navbar content displays horizontally.</li>
            <li>Use the expandOnBreakpoint prop to configure where this happens.</li>
        </ul>
    </section>
</div>

<style>
    /* Make sure there's space for potential fixed nav examples */
    #placement {
        padding-top: 1rem;
        margin-top: 1rem;
    }
</style>
