<script lang="ts">
    import { Button, ButtonCheck, ButtonGroup, ButtonToolbar } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
    import ButtonGroupPlayground from './ButtonGroupPlayground.svelte';

    // Sample code examples for demonstration
    const basicExampleCode = `<ButtonGroup>
    <Button colorVariant="primary">Left</Button>
    <Button colorVariant="primary">Middle</Button>
    <Button colorVariant="primary">Right</Button>
</ButtonGroup>`;

    const buttonLinksExampleCode = `<ButtonGroup>
    <Button aria-current="page" class="active" colorVariant="primary" href="#link1">Active Link 1</Button>
    <Button colorVariant="primary" href="#link2">Link 2</Button>
    <Button colorVariant="primary" href="#link3">Link 3</Button>
</ButtonGroup>`;

    const mixedStylesExampleCode = `<ButtonGroup>
    <Button colorVariant="danger">Left</Button>
    <Button colorVariant="secondary">Middle</Button>
    <Button colorVariant="success">Right</Button>
</ButtonGroup>`;

    const outlinedStylesExampleCode = `<ButtonGroup>
    <Button colorVariant="outline-primary">Left</Button>
    <Button colorVariant="outline-primary">Middle</Button>
    <Button colorVariant="outline-primary">Right</Button>
</ButtonGroup>`;

    const buttonCheckExampleCode = `<ButtonGroup ariaLabel="Toggle button group">
    <ButtonCheck colorVariant="outline-primary" id="toggle-check-1">Option 1</ButtonCheck>
    <ButtonCheck checked colorVariant="outline-primary" id="toggle-check-2">Option 2</ButtonCheck>
</ButtonGroup>

<ButtonGroup ariaLabel="Radio toggle button group">
    <ButtonCheck checked colorVariant="outline-secondary" id="toggle-radio-1" name="radio-toggles" type="radio">Active</ButtonCheck>
    <ButtonCheck colorVariant="outline-secondary" id="toggle-radio-2" name="radio-toggles" type="radio">Inactive</ButtonCheck>
</ButtonGroup>`;

    const toolbarExampleCode = `<ButtonToolbar ariaLabel="Toolbar with button groups">
    <ButtonGroup class="me-2">
        <Button colorVariant="primary">1</Button>
        <Button colorVariant="primary">2</Button>
        <Button colorVariant="primary">3</Button>
        <Button colorVariant="primary">4</Button>
    </ButtonGroup>
    <ButtonGroup class="me-2">
        <Button colorVariant="secondary">5</Button>
        <Button colorVariant="secondary">6</Button>
        <Button colorVariant="secondary">7</Button>
    </ButtonGroup>
    <ButtonGroup>
        <Button colorVariant="info">8</Button>
        <Button colorVariant="info">9</Button>
    </ButtonGroup>
</ButtonToolbar>`;

    const sizingExampleCode = `<ButtonGroup size="lg">
    <Button colorVariant="outline-primary">Left</Button>
    <Button colorVariant="outline-primary">Middle</Button>
    <Button colorVariant="outline-primary">Right</Button>
</ButtonGroup>

<ButtonGroup>
    <Button colorVariant="outline-primary">Left</Button>
    <Button colorVariant="outline-primary">Middle</Button>
    <Button colorVariant="outline-primary">Right</Button>
</ButtonGroup>

<ButtonGroup size="sm">
    <Button colorVariant="outline-primary">Left</Button>
    <Button colorVariant="outline-primary">Middle</Button>
    <Button colorVariant="outline-primary">Right</Button>
</ButtonGroup>`;

    const nestingExampleCode = `<ButtonGroup>
    <Button colorVariant="primary">1</Button>
    <Button colorVariant="primary">2</Button>
    <ButtonGroup>
        <Button colorVariant="primary" id="btnGroupDrop1" class="dropdown-toggle">Dropdown</Button>
        <!-- Dropdown menu would be implemented here -->
    </ButtonGroup>
</ButtonGroup>`;

    const verticalExampleCode = `<ButtonGroup vertical>
    <Button colorVariant="primary">Button</Button>
    <Button colorVariant="primary">Button</Button>
    <Button colorVariant="primary">Button</Button>
    <Button colorVariant="primary">Button</Button>
</ButtonGroup>`;
</script>

<div>
    <div class="mb-5">
        <h1>Button Group</h1>
        <p class="lead">Group a series of buttons together on a single line with the button group.</p>
        <hr />
    </div>

    <!-- Interactive Playground -->
    <section class="mb-5" id="playground">
        <h2 class="wk-quick-link">Playground</h2>
        <p>Experiment with the Button Group component by adjusting the props below:</p>
        <ButtonGroupPlayground />
    </section>

    <!-- Basic Example section -->
    <section class="mb-5" id="basic-example">
        <h2 class="wk-quick-link">Basic Example</h2>
        <p>Wrap a series of <code>Button</code> components with <code>ButtonGroup</code> component.</p>
        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ButtonGroup>
                        <Button id="btnLeft" colorVariant="primary">Left</Button>
                        <Button id="btnMiddle" colorVariant="primary">Middle</Button>
                        <Button id="btnRight" colorVariant="primary">Right</Button>
                    </ButtonGroup>
                </div>
                <SyntaxHighlighter code={basicExampleCode} />
            </div>
        </div>
    </section>

    <!-- Example of Button Links in a Button Group -->
    <section class="mb-5" id="button-links">
        <h2 class="wk-quick-link">Button Links</h2>
        <p>Use the <code>Button</code> component as a link by setting the <code>href</code> prop.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ButtonGroup>
                        <Button aria-current="page" class="active" colorVariant="primary" href="#link1">Active Link 1</Button>
                        <Button colorVariant="primary" href="#link2">Link 2</Button>
                        <Button colorVariant="primary" href="#link3">Link 3</Button>
                    </ButtonGroup>
                </div>

                <SyntaxHighlighter code={buttonLinksExampleCode} />
            </div>
        </div>
    </section>

    <!-- Mixed Styles -->
    <section class="mb-5" id="mixed-styles">
        <h2 class="wk-quick-link">Mixed Styles</h2>
        <p>Mix and match button styles within a button group.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ButtonGroup>
                        <Button colorVariant="danger">Left</Button>
                        <Button colorVariant="warning">Middle</Button>
                        <Button colorVariant="success">Right</Button>
                    </ButtonGroup>
                </div>

                <SyntaxHighlighter code={mixedStylesExampleCode} />
            </div>
        </div>
    </section>

    <!-- Outlined styles -->
    <section class="mb-5" id="outlined-styles">
        <h2 class="wk-quick-link">Outlined Styles</h2>
        <p>Use outlined styles for a different look.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ButtonGroup>
                        <Button colorVariant="outline-primary">Left</Button>
                        <Button colorVariant="outline-primary">Middle</Button>
                        <Button colorVariant="outline-primary">Right</Button>
                    </ButtonGroup>
                </div>

                <SyntaxHighlighter code={outlinedStylesExampleCode} />
            </div>
        </div>
    </section>

    <!-- ButtonCheck toggle buttons -->
    <section class="mb-5" id="button-check">
        <h2 class="wk-quick-link">ButtonCheck Toggle Buttons</h2>
        <p>Use <code>ButtonCheck</code> to render Bootstrap toggle buttons powered by checkbox and radio inputs.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-column gap-2">
                    <ButtonGroup ariaLabel="Toggle button group">
                        <ButtonCheck colorVariant="outline-primary" id="toggle-check-1">Option 1</ButtonCheck>
                        <ButtonCheck checked colorVariant="outline-primary" id="toggle-check-2">Option 2</ButtonCheck>
                    </ButtonGroup>

                    <ButtonGroup ariaLabel="Radio toggle button group">
                        <ButtonCheck checked colorVariant="outline-secondary" id="toggle-radio-1" name="radio-toggles" type="radio"
                            >Active</ButtonCheck>
                        <ButtonCheck colorVariant="outline-secondary" id="toggle-radio-2" name="radio-toggles" type="radio">Inactive</ButtonCheck>
                    </ButtonGroup>
                </div>

                <SyntaxHighlighter code={buttonCheckExampleCode} />
            </div>
        </div>
    </section>

    <!-- Button Toolbar section -->
    <section class="mb-5" id="button-toolbar">
        <h2 class="wk-quick-link">Button Toolbar</h2>
        <p>Combine sets of button groups into button toolbars for more complex components.</p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ButtonToolbar ariaLabel="Toolbar with button groups">
                        <ButtonGroup class="me-2">
                            <Button colorVariant="primary">1</Button>
                            <Button colorVariant="primary">2</Button>
                            <Button colorVariant="primary">3</Button>
                            <Button colorVariant="primary">4</Button>
                        </ButtonGroup>
                        <ButtonGroup class="me-2">
                            <Button colorVariant="secondary">5</Button>
                            <Button colorVariant="secondary">6</Button>
                            <Button colorVariant="secondary">7</Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button colorVariant="info">8</Button>
                            <Button colorVariant="info">9</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>

                <SyntaxHighlighter code={toolbarExampleCode} />
            </div>
        </div>
    </section>

    <!-- Sizing section -->
    <section class="mb-5" id="sizing">
        <h2 class="wk-quick-link">Sizing</h2>
        <p>
            Instead of applying button sizing props to every button in a group, just set the <code>size</code> prop on the <code>ButtonGroup</code>.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3 d-flex flex-column gap-2">
                    <ButtonGroup size="lg">
                        <Button colorVariant="outline-primary">Left</Button>
                        <Button colorVariant="outline-primary">Middle</Button>
                        <Button colorVariant="outline-primary">Right</Button>
                    </ButtonGroup>

                    <ButtonGroup>
                        <Button colorVariant="outline-primary">Left</Button>
                        <Button colorVariant="outline-primary">Middle</Button>
                        <Button colorVariant="outline-primary">Right</Button>
                    </ButtonGroup>

                    <ButtonGroup size="sm">
                        <Button colorVariant="outline-primary">Left</Button>
                        <Button colorVariant="outline-primary">Middle</Button>
                        <Button colorVariant="outline-primary">Right</Button>
                    </ButtonGroup>
                </div>

                <SyntaxHighlighter code={sizingExampleCode} />
            </div>
        </div>
    </section>

    <!-- Nesting section -->
    <section class="mb-5" id="nesting">
        <h2 class="wk-quick-link">Nesting</h2>
        <p>
            Place a <code>ButtonGroup</code> within another <code>ButtonGroup</code> when you want dropdown menus mixed with regular buttons.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ButtonGroup>
                        <Button colorVariant="primary">1</Button>
                        <Button colorVariant="primary">2</Button>
                        <ButtonGroup>
                            <Button colorVariant="primary" id="btnGroupDrop1" class="dropdown-toggle">Dropdown</Button>
                            <!-- Dropdown menu would be implemented here -->
                        </ButtonGroup>
                    </ButtonGroup>
                </div>

                <SyntaxHighlighter code={nestingExampleCode} />
            </div>
        </div>
    </section>

    <!-- Vertical variation -->
    <section class="mb-5" id="vertical">
        <h2 class="wk-quick-link">Vertical Variation</h2>
        <p>
            Make a set of buttons appear vertically stacked rather than horizontally by adding the <code>vertical</code> prop.
        </p>

        <div class="card">
            <div class="card-body">
                <div class="mb-3">
                    <ButtonGroup isVertical={true}>
                        <Button colorVariant="primary">Button</Button>
                        <Button colorVariant="primary">Button</Button>
                        <Button colorVariant="primary">Button</Button>
                        <Button colorVariant="primary">Button</Button>
                    </ButtonGroup>
                </div>

                <SyntaxHighlighter code={verticalExampleCode} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-5" id="api">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">ButtonGroup Props</h3>
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
                        <td><code>aria-label</code></td>
                        <td><code>string</code></td>
                        <td><code>'Button group [id]'</code></td>
                        <td>ARIA label for the button group</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>Additional CSS classes to apply to the component.</td>
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
                        <td>—</td>
                        <td>Unique identifier for the button. If not specified, it will be auto-generated.</td>
                    </tr>
                    <tr>
                        <td><code>isVertical</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Makes the button group stack vertically</td>
                    </tr>
                    <tr>
                        <td><code>size</code></td>
                        <td><code>string</code></td>
                        <td>-</td>
                        <td>Sets the size for all buttons in the group. Values: 'sm', 'lg'</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">ButtonCheck Props</h3>
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
                        <td><code>autocomplete</code></td>
                        <td><code>string</code></td>
                        <td><code>'off'</code></td>
                        <td>Autocomplete behavior for the underlying input.</td>
                    </tr>
                    <tr>
                        <td><code>checked</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Bindable checked state for checkbox inputs.</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>Additional CSS classes applied to the input element.</td>
                    </tr>
                    <tr>
                        <td><code>colorVariant</code></td>
                        <td><code>ButtonColorVariant</code></td>
                        <td><code>undefined</code></td>
                        <td>Bootstrap button variant for the label (for example, <code>primary</code> or <code>outline-primary</code>).</td>
                    </tr>
                    <tr>
                        <td><code>elementRef</code></td>
                        <td><code>HTMLInputElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the input element.</td>
                    </tr>
                    <tr>
                        <td><code>group</code></td>
                        <td><code>string | unknown[]</code></td>
                        <td><code>undefined</code></td>
                        <td>Bindable group value for grouped radio or checkbox inputs.</td>
                    </tr>
                    <tr>
                        <td><code>id</code></td>
                        <td><code>string</code></td>
                        <td><code>'btn-check-[id]'</code></td>
                        <td>Input ID used by the label <code>for</code> attribute.</td>
                    </tr>
                    <tr>
                        <td><code>labelClass</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>Additional CSS classes applied to the label element.</td>
                    </tr>
                    <tr>
                        <td><code>labelElementRef</code></td>
                        <td><code>HTMLLabelElement | null</code></td>
                        <td><code>null</code></td>
                        <td>Reference to the label element.</td>
                    </tr>
                    <tr>
                        <td><code>type</code></td>
                        <td><code>'checkbox' | 'radio'</code></td>
                        <td><code>'checkbox'</code></td>
                        <td>Input type for the toggle button.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">ButtonToolbar Props</h3>
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
                        <td><code>aria-label</code></td>
                        <td><code>string</code></td>
                        <td><code>'Button toolbar [id]'</code></td>
                        <td>ARIA label for the button group</td>
                    </tr>
                    <tr>
                        <td><code>class</code></td>
                        <td><code>string</code></td>
                        <td><code>undefined</code></td>
                        <td>Additional CSS classes to apply to the component.</td>
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
                        <td>—</td>
                        <td>Unique identifier for the button. If not specified, it will be auto-generated.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">CSS Classes</h3>
        <p>The component applies Bootstrap's button group classes:</p>
        <ul>
            <li><code>btn-group</code> - Applied when isVertical prop is false</li>
            <li><code>btn-group-vertical</code> - Applied when isVertical prop is true</li>
            <li><code>btn-group-lg</code> - Applied when size="lg"</li>
            <li><code>btn-group-sm</code> - Applied when size="sm"</li>
            <li><code>btn-check</code> - Applied to the ButtonCheck input element.</li>
            <li><code>btn</code> - Applied to the ButtonCheck label element.</li>
            <li><code>btn-[variant]</code> - Applied to ButtonCheck labels when colorVariant is set.</li>
            <li><code>btn-toolbar</code> - Applied when using the ButtonToolbar component.</li>
        </ul>
    </section>
</div>
