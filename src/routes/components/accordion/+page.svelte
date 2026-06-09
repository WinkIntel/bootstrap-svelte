<script lang="ts">
    import { Accordion } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import AccordionPlayground from './AccordionPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<Accordion.Root>
  <Accordion.Item>
    <Accordion.Header>
      <Accordion.Button>Accordion Item #1</Accordion.Button>
    </Accordion.Header>
    <Accordion.Collapse>
      <Accordion.Body>
        <strong>This is the first item's accordion body.</strong>
        It is shown by default, until the collapse plugin adds the appropriate
        classes that we use to style each element. You can modify any of this
        with custom CSS or overriding our default variables.
      </Accordion.Body>
    </Accordion.Collapse>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Header>
      <Accordion.Button>Accordion Item #2</Accordion.Button>
    </Accordion.Header>
    <Accordion.Collapse>
      <Accordion.Body>
        <strong>This is the second item's accordion body.</strong>
        It is hidden by default, until the collapse plugin adds the appropriate
        classes that we use to style each element.
      </Accordion.Body>
    </Accordion.Collapse>
  </Accordion.Item>
</Accordion.Root>`;

    const alwaysOpenExampleCode = `<Accordion.Root isMultiple={true}>
  <Accordion.Item>
    <Accordion.Header>
      <Accordion.Button>Accordion Item #1</Accordion.Button>
    </Accordion.Header>
    <Accordion.Collapse>
      <Accordion.Body>
        <strong>This is the first item's accordion body.</strong>
        It can remain open when another item is opened, because
        the isMultiple prop is set to true.
      </Accordion.Body>
    </Accordion.Collapse>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Header>
      <Accordion.Button>Accordion Item #2</Accordion.Button>
    </Accordion.Header>
    <Accordion.Collapse>
      <Accordion.Body>
        <strong>This is the second item's accordion body.</strong>
        It can stay open when other items are opened.
      </Accordion.Body>
    </Accordion.Collapse>
  </Accordion.Item>
</Accordion.Root>`;

    const flushExampleCode = `<Accordion.Root isFlush={true}>
  <Accordion.Item>
    <Accordion.Header>
      <Accordion.Button>Accordion Item #1</Accordion.Button>
    </Accordion.Header>
    <Accordion.Collapse>
      <Accordion.Body>
        <strong>This is the first item's accordion body.</strong>
        Notice there is no border or background. This is a flush accordion.
      </Accordion.Body>
    </Accordion.Collapse>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Header>
      <Accordion.Button>Accordion Item #2</Accordion.Button>
    </Accordion.Header>
    <Accordion.Collapse>
      <Accordion.Body>
        <strong>This is the second item's accordion body.</strong>
        The flush accordion removes borders and background.
      </Accordion.Body>
    </Accordion.Collapse>
  </Accordion.Item>
</Accordion.Root>`;

    const darkThemeExampleCode = `<div class="bg-dark p-4 rounded">
  <Accordion.Root>
    <Accordion.Item class="bg-dark text-white">
      <Accordion.Header>
        <Accordion.Button class="text-white">Dark Theme Item #1</Accordion.Button>
      </Accordion.Header>
      <Accordion.Collapse>
        <Accordion.Body>
          <strong>This is styled with dark theme classes.</strong>
          You can customize the appearance using standard Bootstrap classes.
        </Accordion.Body>
      </Accordion.Collapse>
    </Accordion.Item>
    <Accordion.Item class="bg-dark text-white">
      <Accordion.Header>
        <Accordion.Button class="text-white">Dark Theme Item #2</Accordion.Button>
      </Accordion.Header>
      <Accordion.Collapse>
        <Accordion.Body>
          <strong>This is the second dark-themed item.</strong>
          Custom styling can be applied to create various visual effects.
        </Accordion.Body>
      </Accordion.Collapse>
    </Accordion.Item>
  </Accordion.Root>
</div>`;

    // For API documentation
    const apiComponents = [
        {
            name: 'Root',
            description: 'The main accordion container component',
            props: [
                { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes to apply' },
                { name: 'elementRef', type: 'HTMLElement | null', default: 'null', description: 'Reference to the DOM element' },
                { name: 'isMultiple', type: 'boolean', default: 'false', description: 'Allows multiple items to be open simultaneously' },
                { name: 'isFlush', type: 'boolean', default: 'false', description: 'Removes borders and background from the accordion' },
                { name: 'id', type: 'string', default: 'auto-generated', description: 'Unique ID for the collapse element' }
            ]
        },
        {
            name: 'Item',
            description: 'Container for an individual accordion item',
            props: [
                { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes to apply' },
                { name: 'elementRef', type: 'HTMLElement | null', default: 'null', description: 'Reference to the DOM element' },
                { name: 'isExpanded', type: 'boolean', default: 'false', description: 'Controls whether the item is initially expanded' },
                { name: 'id', type: 'string', default: 'auto-generated', description: 'Unique ID for the collapse element' }
            ]
        },
        {
            name: 'Header',
            description: 'The heading container for the accordion item',
            props: [
                { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes to apply' },
                { name: 'elementRef', type: 'HTMLElement | null', default: 'null', description: 'Reference to the DOM element' },
                { name: 'id', type: 'string', default: 'auto-generated', description: 'Unique ID for the collapse element' }
            ]
        },
        {
            name: 'Button',
            description: 'The clickable button that toggles the accordion item',
            props: [
                { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes to apply' },
                { name: 'elementRef', type: 'HTMLElement | null', default: 'null', description: 'Reference to the DOM element' },
                { name: 'id', type: 'string', default: 'auto-generated', description: 'Unique ID for the collapse element' }
            ]
        },
        {
            name: 'Collapse',
            description: 'The collapsible container that wraps the accordion body',
            props: [
                { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes to apply' },
                { name: 'elementRef', type: 'HTMLElement | null', default: 'null', description: 'Reference to the DOM element' },
                { name: 'id', type: 'string', default: 'auto-generated', description: 'Unique ID for the collapse element' }
            ]
        },
        {
            name: 'Body',
            description: 'The content container for the accordion item',
            props: [
                { name: 'class', type: 'string', default: 'undefined', description: 'Additional CSS classes to apply' },
                { name: 'elementRef', type: 'HTMLElement | null', default: 'null', description: 'Reference to the DOM element' },
                { name: 'id', type: 'string', default: 'auto-generated', description: 'Unique ID for the collapse element' }
            ]
        }
    ];
</script>

<div>
    <div class="mb-5">
        <h1>Accordion</h1>
        <p class="lead">
            Bootstrap's accordion component built with Svelte 5. Use the accordion component to build vertically collapsing accordions.
        </p>
        <hr />
    </div>

    <!-- Playground section -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Accordion component by adjusting the props below:</p>
        <AccordionPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>
            The basic accordion includes several items that can be expanded and collapsed independently. By default, only one item can be open at a
            time.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Accordion.Root>
                        <Accordion.Item isExpanded={true}>
                            <Accordion.Header>
                                <Accordion.Button>Accordion Item #1</Accordion.Button>
                            </Accordion.Header>
                            <Accordion.Collapse>
                                <Accordion.Body>
                                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds
                                    the appropriate classes that we use to style each element. These classes control the overall appearance, as well
                                    as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our
                                    default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>.
                                </Accordion.Body>
                            </Accordion.Collapse>
                        </Accordion.Item>
                        <Accordion.Item>
                            <Accordion.Header>
                                <Accordion.Button>Accordion Item #2</Accordion.Button>
                            </Accordion.Header>
                            <Accordion.Collapse>
                                <Accordion.Body>
                                    <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the
                                    appropriate classes that we use to style each element. These classes control the overall appearance, as well as the
                                    showing and hiding via CSS transitions.
                                </Accordion.Body>
                            </Accordion.Collapse>
                        </Accordion.Item>
                        <Accordion.Item>
                            <Accordion.Header>
                                <Accordion.Button>Accordion Item #3</Accordion.Button>
                            </Accordion.Header>
                            <Accordion.Collapse>
                                <Accordion.Body>
                                    <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the
                                    appropriate classes that we use to style each element. These classes control the overall appearance, as well as the
                                    showing and hiding via CSS transitions.
                                </Accordion.Body>
                            </Accordion.Collapse>
                        </Accordion.Item>
                    </Accordion.Root>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Always Open Example section -->
    <section class="mb-5" id="always-open">
        <h2 class="wk-quick-link">Always Open</h2>
        <p>
            Set the <code>isMultiple</code> prop to <code>true</code> to make accordion items stay open when another item is opened.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Accordion.Root isMultiple={true}>
                        <Accordion.Item isExpanded={true}>
                            <Accordion.Header>
                                <Accordion.Button>Accordion Item #1</Accordion.Button>
                            </Accordion.Header>
                            <Accordion.Collapse>
                                <Accordion.Body>
                                    <strong>This is the first item's accordion body.</strong> It can remain open when another item is opened, because
                                    the <code>isMultiple</code> prop is set to <code>true</code>.
                                </Accordion.Body>
                            </Accordion.Collapse>
                        </Accordion.Item>
                        <Accordion.Item>
                            <Accordion.Header>
                                <Accordion.Button>Accordion Item #2</Accordion.Button>
                            </Accordion.Header>
                            <Accordion.Collapse>
                                <Accordion.Body>
                                    <strong>This is the second item's accordion body.</strong> It can stay open when other items are opened.
                                </Accordion.Body>
                            </Accordion.Collapse>
                        </Accordion.Item>
                    </Accordion.Root>
                </div>
                <SyntaxHighlighter code={alwaysOpenExampleCode} />
            </div>
        </div>
    </section>

    <!-- Flush Example section -->
    <section class="mb-5" id="flush">
        <h2 class="wk-quick-link">Flush</h2>
        <p>
            Add the <code>isFlush</code> prop to remove the default background color, some borders, and rounded corners.
        </p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <Accordion.Root isFlush={true}>
                        <Accordion.Item isExpanded={true}>
                            <Accordion.Header>
                                <Accordion.Button>Accordion Item #1</Accordion.Button>
                            </Accordion.Header>
                            <Accordion.Collapse>
                                <Accordion.Body>
                                    <strong>This is the first item's accordion body.</strong> Notice there is no border or background. This is a flush accordion.
                                </Accordion.Body>
                            </Accordion.Collapse>
                        </Accordion.Item>
                        <Accordion.Item>
                            <Accordion.Header>
                                <Accordion.Button>Accordion Item #2</Accordion.Button>
                            </Accordion.Header>
                            <Accordion.Collapse>
                                <Accordion.Body>
                                    <strong>This is the second item's accordion body.</strong> The flush accordion removes borders and background.
                                </Accordion.Body>
                            </Accordion.Collapse>
                        </Accordion.Item>
                    </Accordion.Root>
                </div>
                <SyntaxHighlighter code={flushExampleCode} />
            </div>
        </div>
    </section>

    <!-- Custom Styling Example -->
    <section class="mb-5" id="custom-styling">
        <h2 class="wk-quick-link">Custom Styling</h2>
        <p>You can style the accordion using Bootstrap's utility classes to create custom themes.</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <div class="bg-dark p-4 rounded">
                        <Accordion.Root>
                            <Accordion.Item class="bg-dark text-white border-light">
                                <Accordion.Header>
                                    <Accordion.Button class="text-white bg-dark">Dark Theme Item #1</Accordion.Button>
                                </Accordion.Header>
                                <Accordion.Collapse>
                                    <Accordion.Body>
                                        <strong>This is styled with dark theme classes.</strong> You can customize the appearance using standard Bootstrap
                                        classes.
                                    </Accordion.Body>
                                </Accordion.Collapse>
                            </Accordion.Item>
                            <Accordion.Item class="bg-dark text-white border-light">
                                <Accordion.Header>
                                    <Accordion.Button class="text-white bg-dark">Dark Theme Item #2</Accordion.Button>
                                </Accordion.Header>
                                <Accordion.Collapse>
                                    <Accordion.Body>
                                        <strong>This is the second dark-themed item.</strong> Custom styling can be applied to create various visual effects.
                                    </Accordion.Body>
                                </Accordion.Collapse>
                            </Accordion.Item>
                        </Accordion.Root>
                    </div>
                </div>
                <SyntaxHighlighter code={darkThemeExampleCode} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <p>The Accordion component is composed of several sub-components:</p>

        {#each apiComponents as apiComponent, apiComponentIndex (`apiComponent-${apiComponentIndex}`)}
            <h3 class="h5 mt-4">Accordion.{apiComponent.name}</h3>
            <p>{apiComponent.description}</p>

            <h4 class="h6 mt-3">Props</h4>
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
                        {#each apiComponent.props as prop, propIndex (`apiComponent-${apiComponentIndex}-prop-${propIndex}`)}
                            <tr>
                                <td><code>{prop.name}</code></td>
                                <td><code>{prop.type}</code></td>
                                <td><code>{prop.default}</code></td>
                                <td>{prop.description}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/each}

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The components apply Bootstrap's accordion classes based on the provided props:</p>
        <ul>
            <li><code>accordion</code> - Base class for the Root component</li>
            <li><code>accordion-flush</code> - Applied to Root when isFlush is true</li>
            <li><code>accordion-item</code> - Base class for the Item component</li>
            <li><code>accordion-header</code> - Base class for the Header component</li>
            <li><code>accordion-button</code> - Base class for the Button component</li>
            <li><code>accordion-collapse</code> - Base class for the Collapse component</li>
            <li><code>accordion-body</code> - Base class for the Body component</li>
            <li><code>collapsed</code> - Applied to Button when the corresponding item is not expanded</li>
            <li><code>show</code> - Applied to Collapse when the corresponding item is expanded</li>
        </ul>
    </section>
</div>
