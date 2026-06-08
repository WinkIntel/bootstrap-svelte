<script lang="ts">
    import { Button, Dropdown, Form } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
</script>

<div>
    <div class="mb-4">
        <h1>Form Input Group</h1>
        <p class="lead">
            Easily extend form controls by adding text, buttons, or button groups on either side of textual inputs, custom selects, and custom file
            inputs.
        </p>
        <hr />
    </div>

    <section class="mb-4" id="form-input-group-examples">
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Basic example</h2>

                    <Form.InputGroup class="mb-3">
                        <Form.InputGroupText id="basic-addon1">@</Form.InputGroupText>
                        <Form.TextInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                    </Form.InputGroup>
                    <Form.InputGroup class="mb-3">
                        <Form.TextInput placeholder="Recipient’s username" aria-label="Recipient’s username" aria-describedby="basic-addon2" />
                        <Form.InputGroupText id="basic-addon2">@example.com</Form.InputGroupText>
                    </Form.InputGroup>
                    <div class="mb-3">
                        <Form.InputLabel for="basic-url">Your vanity URL</Form.InputLabel>
                        <Form.InputGroup class="input-group">
                            <Form.InputGroupText id="basic-addon3">https://example.com/users/</Form.InputGroupText>
                            <Form.TextInput id="basic-url" aria-describedby="basic-addon3 basic-addon4" />
                        </Form.InputGroup>
                        <Form.HelperText id="basic-addon4">Example help text goes outside the input group.</Form.HelperText>
                    </div>
                    <Form.InputGroup class="mb-3">
                        <Form.InputGroupText>$</Form.InputGroupText>
                        <Form.TextInput aria-label="Amount (to the nearest dollar)" />
                        <Form.InputGroupText>.00</Form.InputGroupText>
                    </Form.InputGroup>
                    <Form.InputGroup class="mb-3">
                        <Form.TextInput placeholder="Username" aria-label="Username" />
                        <Form.InputGroupText>@</Form.InputGroupText>
                        <Form.TextInput placeholder="Server" aria-label="Server" />
                    </Form.InputGroup>
                    <Form.InputGroup>
                        <Form.InputGroupText>With textarea</Form.InputGroupText>
                        <Form.TextArea aria-label="With textarea"></Form.TextArea>
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup class="mb-3">
    <Form.InputGroupText id="basic-addon1">@</Form.InputGroupText>
    <Form.TextInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
</Form.InputGroup>
<Form.InputGroup class="mb-3">
    <Form.TextInput placeholder="Recipient’s username" aria-label="Recipient’s username" aria-describedby="basic-addon2" />
    <Form.InputGroupText id="basic-addon2">@example.com</Form.InputGroupText>
</Form.InputGroup>
<div class="mb-3">
    <Form.InputLabel for="basic-url">Your vanity URL</Form.InputLabel>
    <Form.InputGroup class="input-group">
        <Form.InputGroupText id="basic-addon3">https://example.com/users/</Form.InputGroupText>
        <Form.TextInput id="basic-url" aria-describedby="basic-addon3 basic-addon4" />
    </Form.InputGroup>
    <Form.HelperText id="basic-addon4">Example help text goes outside the input group.</Form.HelperText>
</div>
<Form.InputGroup class="mb-3">
    <Form.InputGroupText>$</Form.InputGroupText>
    <Form.TextInput aria-label="Amount (to the nearest dollar)" />
    <Form.InputGroupText>.00</Form.InputGroupText>
</Form.InputGroup>
<Form.InputGroup class="mb-3">
    <Form.TextInput placeholder="Username" aria-label="Username" />
    <Form.InputGroupText>@</Form.InputGroupText>
    <Form.TextInput placeholder="Server" aria-label="Server" />
</Form.InputGroup>
<Form.InputGroup>
    <Form.InputGroupText>With textarea</Form.InputGroupText>
    <Form.TextArea aria-label="With textarea"></Form.TextArea>
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Wrapping</h2>
                    <p>
                        Input groups wrap by default via <code>flex-wrap: wrap</code> in order to accommodate custom form field validation within an
                        input group. You may disable this with <code>.flex-nowrap</code>.
                    </p>

                    <Form.InputGroup noWrap>
                        <Form.InputGroupText id="addon-wrapping">@</Form.InputGroupText>
                        <Form.TextInput placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" />
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup noWrap>
    <Form.InputGroupText id="addon-wrapping">@</Form.InputGroupText>
    <Form.TextInput placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" />
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Border radius</h2>
                    <p>
                        Due to limitations of browser support at the time, <code>border-radius</code> styles can only be applied to the first and last
                        children within the <code>.input-group</code> class. Any non-visible element in one of those positions will cause the input group
                        to render incorrectly.
                    </p>

                    <Form.InputGroup>
                        <Form.InputGroupText id="visible-addon">@</Form.InputGroupText>
                        <Form.TextInput placeholder="Username" aria-label="Username" aria-describedby="visible-addon" />
                        <Form.TextInput class="d-none" placeholder="Hidden input" aria-label="Hidden input" aria-describedby="visible-addon" />
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup>
    <Form.InputGroupText id="visible-addon">@</Form.InputGroupText>
    <Form.TextInput placeholder="Username" aria-label="Username" aria-describedby="visible-addon" />
    <Form.TextInput class="d-none" placeholder="Hidden input" aria-label="Hidden input" aria-describedby="visible-addon" />
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Sizing</h2>

                    <Form.InputGroup class="mb-3" sizing="sm">
                        <Form.InputGroupText id="inputGroup-sizing-sm">Small</Form.InputGroupText>
                        <Form.TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                    </Form.InputGroup>

                    <Form.InputGroup class="mb-3">
                        <Form.InputGroupText id="inputGroup-sizing-default">Default</Form.InputGroupText>
                        <Form.TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                    </Form.InputGroup>

                    <Form.InputGroup sizing="lg">
                        <Form.InputGroupText id="inputGroup-sizing-lg">Large</Form.InputGroupText>
                        <Form.TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" />
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup class="mb-3" sizing="sm">
    <Form.InputGroupText id="inputGroup-sizing-sm">Small</Form.InputGroupText>
    <Form.TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
</Form.InputGroup>

<Form.InputGroup class="mb-3">
    <Form.InputGroupText id="inputGroup-sizing-default">Default</Form.InputGroupText>
    <Form.TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
</Form.InputGroup>

<Form.InputGroup sizing="lg">
    <Form.InputGroupText id="inputGroup-sizing-lg">Large</Form.InputGroupText>
    <Form.TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" />
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Checkboxes and radios</h2>

                    <Form.InputGroup class="mb-3">
                        <Form.InputGroupText>
                            <Form.CheckInput class="mt-0" value="" aria-label="Checkbox for following text input" />
                        </Form.InputGroupText>
                        <Form.TextInput aria-label="Text input with checkbox" />
                    </Form.InputGroup>

                    <Form.InputGroup>
                        <Form.InputGroupText>
                            <Form.RadioInput class="mt-0" value="" aria-label="Radio button for following text input" />
                        </Form.InputGroupText>
                        <Form.TextInput aria-label="Text input with radio button" />
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup class="mb-3">
    <Form.InputGroupText>
        <Form.CheckInput class="mt-0" value="" aria-label="Checkbox for following text input" />
    </Form.InputGroupText>
    <Form.TextInput aria-label="Text input with checkbox" />
</Form.InputGroup>

<Form.InputGroup>
    <Form.InputGroupText>
        <Form.RadioInput class="mt-0" value="" aria-label="Radio button for following text input" />
    </Form.InputGroupText>
    <Form.TextInput aria-label="Text input with radio button" />
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Multiple inputs</h2>

                    <Form.InputGroup>
                        <Form.InputGroupText>First and last name</Form.InputGroupText>
                        <Form.TextInput aria-label="First name" />
                        <Form.TextInput aria-label="Last name" />
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup>
    <Form.InputGroupText>First and last name</Form.InputGroupText>
    <Form.TextInput aria-label="First name" />
    <Form.TextInput aria-label="Last name" />
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Multiple addons</h2>

                    <Form.InputGroup class="mb-3">
                        <Form.InputGroupText>$</Form.InputGroupText>
                        <Form.InputGroupText>0.00</Form.InputGroupText>
                        <Form.TextInput aria-label="Dollar amount (with dot and two decimal places)" />
                    </Form.InputGroup>

                    <Form.InputGroup>
                        <Form.TextInput aria-label="Dollar amount (with dot and two decimal places)" />
                        <Form.InputGroupText>$</Form.InputGroupText>
                        <Form.InputGroupText>0.00</Form.InputGroupText>
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup class="mb-3">
    <Form.InputGroupText>$</Form.InputGroupText>
    <Form.InputGroupText>0.00</Form.InputGroupText>
    <Form.TextInput aria-label="Dollar amount (with dot and two decimal places)" />
</Form.InputGroup>

<Form.InputGroup>
    <Form.TextInput aria-label="Dollar amount (with dot and two decimal places)" />
    <Form.InputGroupText>$</Form.InputGroupText>
    <Form.InputGroupText>0.00</Form.InputGroupText>
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Button addons</h2>

                    <Form.InputGroup class="mb-3">
                        <Button colorVariant="outline-secondary" id="button-addon1">Button</Button>
                        <Form.TextInput placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                    </Form.InputGroup>
                    <Form.InputGroup class="mb-3">
                        <Form.TextInput placeholder="Recipient’s username" aria-label="Recipient’s username" aria-describedby="button-addon2" />
                        <Button colorVariant="outline-secondary" id="button-addon2">Button</Button>
                    </Form.InputGroup>
                    <Form.InputGroup class="mb-3">
                        <Button colorVariant="outline-secondary">Button</Button>
                        <Button colorVariant="outline-secondary">Button</Button>
                        <Form.TextInput placeholder="" aria-label="Example text with two button addons" />
                    </Form.InputGroup>
                    <Form.InputGroup>
                        <Form.TextInput placeholder="Recipient’s username" aria-label="Recipient’s username with two button addons" />
                        <Button colorVariant="outline-secondary">Button</Button>
                        <Button colorVariant="outline-secondary">Button</Button>
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup class="mb-3">
    <Button colorVariant="outline-secondary" id="button-addon1">Button</Button>
    <Form.TextInput placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
</Form.InputGroup>
<Form.InputGroup class="mb-3">
    <Form.TextInput placeholder="Recipient’s username" aria-label="Recipient’s username" aria-describedby="button-addon2" />
    <Button colorVariant="outline-secondary" id="button-addon2">Button</Button>
</Form.InputGroup>
<Form.InputGroup class="mb-3">
    <Button colorVariant="outline-secondary">Button</Button>
    <Button colorVariant="outline-secondary">Button</Button>
    <Form.TextInput placeholder="" aria-label="Example text with two button addons" />
</Form.InputGroup>
<Form.InputGroup>
    <Form.TextInput placeholder="Recipient’s username" aria-label="Recipient’s username with two button addons" />
    <Button colorVariant="outline-secondary">Button</Button>
    <Button colorVariant="outline-secondary">Button</Button>
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Buttons with dropdowns</h2>

                    <Form.InputGroup class="mb-3">
                        <Dropdown.Root>
                            <Dropdown.Toggle class="rounded-end-0" colorVariant="outline-secondary">Dropdown</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#!">Action</Dropdown.Item>
                                <Dropdown.Item href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#!">Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Root>
                        <Form.TextInput aria-label="Text input with dropdown button" />
                    </Form.InputGroup>

                    <Form.InputGroup class="mb-3">
                        <Form.TextInput aria-label="Text input with dropdown button" />
                        <Dropdown.Root>
                            <Dropdown.Toggle class="rounded-start-0" colorVariant="outline-secondary">Dropdown</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#!">Action</Dropdown.Item>
                                <Dropdown.Item href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#!">Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Root>
                    </Form.InputGroup>

                    <Form.InputGroup>
                        <Dropdown.Root>
                            <Dropdown.Toggle class="rounded-end-0" colorVariant="outline-secondary">Dropdown</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#!">Action</Dropdown.Item>
                                <Dropdown.Item href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#!">Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Root>
                        <Form.TextInput aria-label="Text input with 2 dropdown buttons" />
                        <Dropdown.Root>
                            <Dropdown.Toggle class="rounded-start-0" colorVariant="outline-secondary">Dropdown</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#!">Action</Dropdown.Item>
                                <Dropdown.Item href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#!">Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Root>
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup class="mb-3">
    <Dropdown.Root>
        <Dropdown.Toggle class="rounded-end-0" colorVariant="outline-secondary">Dropdown</Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item href="#!">Action</Dropdown.Item>
            <Dropdown.Item href="#!">Another action</Dropdown.Item>
            <Dropdown.Item href="#!">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#!">Separated link</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
    <Form.TextInput aria-label="Text input with dropdown button" />
</Form.InputGroup>

<Form.InputGroup class="mb-3">
    <Form.TextInput aria-label="Text input with dropdown button" />
    <Dropdown.Root>
        <Dropdown.Toggle class="rounded-start-0" colorVariant="outline-secondary">Dropdown</Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item href="#!">Action</Dropdown.Item>
            <Dropdown.Item href="#!">Another action</Dropdown.Item>
            <Dropdown.Item href="#!">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#!">Separated link</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
</Form.InputGroup>

<Form.InputGroup>
    <Dropdown.Root>
        <Dropdown.Toggle class="rounded-end-0" colorVariant="outline-secondary">Dropdown</Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item href="#!">Action</Dropdown.Item>
            <Dropdown.Item href="#!">Another action</Dropdown.Item>
            <Dropdown.Item href="#!">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#!">Separated link</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
    <Form.TextInput aria-label="Text input with 2 dropdown buttons" />
    <Dropdown.Root>
        <Dropdown.Toggle class="rounded-start-0" colorVariant="outline-secondary">Dropdown</Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item href="#!">Action</Dropdown.Item>
            <Dropdown.Item href="#!">Another action</Dropdown.Item>
            <Dropdown.Item href="#!">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#!">Separated link</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Segmented buttons</h2>

                    <Form.InputGroup class="mb-3">
                        <Dropdown.Root isButtonGroup={true}>
                            <Button colorVariant="outline-secondary">Action</Button>
                            <Dropdown.Toggle class="rounded-end-0" colorVariant="outline-secondary" isSplit={true}></Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#!">Action</Dropdown.Item>
                                <Dropdown.Item href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#!">Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Root>
                        <Form.TextInput aria-label="Text input with segmented dropdown button" />
                    </Form.InputGroup>

                    <Form.InputGroup>
                        <Form.TextInput aria-label="Text input with segmented dropdown button" />
                        <Dropdown.Root isButtonGroup={true}>
                            <Button class="rounded-start-0" colorVariant="outline-secondary">Action</Button>
                            <Dropdown.Toggle colorVariant="outline-secondary" isSplit={true}></Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#!">Action</Dropdown.Item>
                                <Dropdown.Item href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#!">Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Root>
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup class="mb-3">
    <Dropdown.Root isButtonGroup={true}>
        <Button colorVariant="outline-secondary">Action</Button>
        <Dropdown.Toggle class="rounded-end-0" colorVariant="outline-secondary" isSplit={true}></Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item href="#!">Action</Dropdown.Item>
            <Dropdown.Item href="#!">Another action</Dropdown.Item>
            <Dropdown.Item href="#!">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#!">Separated link</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
    <Form.TextInput aria-label="Text input with segmented dropdown button" />
</Form.InputGroup>

<Form.InputGroup>
    <Form.TextInput aria-label="Text input with segmented dropdown button" />
    <Dropdown.Root isButtonGroup={true}>
        <Button class="rounded-start-0" colorVariant="outline-secondary">Action</Button>
        <Dropdown.Toggle colorVariant="outline-secondary" isSplit={true}></Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item href="#!">Action</Dropdown.Item>
            <Dropdown.Item href="#!">Another action</Dropdown.Item>
            <Dropdown.Item href="#!">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#!">Separated link</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown.Root>
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Select inputs</h2>

                    <Form.InputGroup class="mb-3">
                        <Form.InputGroupText elementType="label" for="inputGroupSelect01">Options</Form.InputGroupText>
                        <Form.Select id="inputGroupSelect01">
                            <option selected>Choose...</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </Form.InputGroup>

                    <Form.InputGroup class="mb-3">
                        <Form.Select id="inputGroupSelect02">
                            <option selected>Choose...</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                        <Form.InputGroupText elementType="label" for="inputGroupSelect02">Options</Form.InputGroupText>
                    </Form.InputGroup>

                    <Form.InputGroup class="mb-3">
                        <Button colorVariant="outline-secondary">Button</Button>
                        <Form.Select id="inputGroupSelect03" aria-label="Example select with button addon">
                            <option selected>Choose...</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </Form.InputGroup>

                    <Form.InputGroup>
                        <Form.Select id="inputGroupSelect04" aria-label="Example select with button addon">
                            <option selected>Choose...</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                        <Button colorVariant="outline-secondary">Button</Button>
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup class="mb-3">
    <Form.InputGroupText elementType="label" for="inputGroupSelect01">Options</Form.InputGroupText>
    <Form.Select id="inputGroupSelect01">
        <option selected>Choose...</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
    </Form.Select>
</Form.InputGroup>

<Form.InputGroup class="mb-3">
    <Form.Select id="inputGroupSelect02">
        <option selected>Choose...</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
    </Form.Select>
    <Form.InputGroupText elementType="label" for="inputGroupSelect02">Options</Form.InputGroupText>
</Form.InputGroup>

<Form.InputGroup class="mb-3">
    <Button colorVariant="outline-secondary">Button</Button>
    <Form.Select id="inputGroupSelect03" aria-label="Example select with button addon">
        <option selected>Choose...</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
    </Form.Select>
</Form.InputGroup>

<Form.InputGroup>
    <Form.Select id="inputGroupSelect04" aria-label="Example select with button addon">
        <option selected>Choose...</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
    </Form.Select>
    <Button colorVariant="outline-secondary">Button</Button>
</Form.InputGroup>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">File Inputs</h2>

                    <Form.InputGroup class="mb-3">
                        <Form.InputGroupText elementType="label" for="inputGroupFile01">Upload</Form.InputGroupText>
                        <Form.FileInput id="inputGroupFile01" />
                    </Form.InputGroup>

                    <Form.InputGroup class="mb-3">
                        <Form.FileInput id="inputGroupFile02" />
                        <Form.InputGroupText elementType="label" for="inputGroupFile02">Upload</Form.InputGroupText>
                    </Form.InputGroup>

                    <Form.InputGroup class="mb-3">
                        <Button colorVariant="outline-secondary" id="inputGroupFileAddon03">Button</Button>
                        <Form.FileInput id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" aria-label="Upload" />
                    </Form.InputGroup>

                    <Form.InputGroup>
                        <Form.FileInput id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                        <Button colorVariant="outline-secondary" id="inputGroupFileAddon04">Button</Button>
                    </Form.InputGroup>
                </div>
                <SyntaxHighlighter
                    code={`<Form.InputGroup class="mb-3">
    <Form.InputGroupText elementType="label" for="inputGroupFile01">Upload</Form.InputGroupText>
    <Form.FileInput id="inputGroupFile01" />
</Form.InputGroup>

<Form.InputGroup class="mb-3">
    <Form.FileInput id="inputGroupFile02" />
    <Form.InputGroupText elementType="label" for="inputGroupFile02">Upload</Form.InputGroupText>
</Form.InputGroup>

<Form.InputGroup class="mb-3">
    <Button colorVariant="outline-secondary" id="inputGroupFileAddon03">Button</Button>
    <Form.FileInput id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" aria-label="Upload" />
</Form.InputGroup>

<Form.InputGroup>
    <Form.FileInput id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
    <Button colorVariant="outline-secondary" id="inputGroupFileAddon04">Button</Button>
</Form.InputGroup>`} />
            </div>
        </div>
    </section>
</div>
