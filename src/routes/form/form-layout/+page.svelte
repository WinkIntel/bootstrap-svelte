<script lang="ts">
    import { Button, Form } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';
</script>

<div>
    <div class="mb-4">
        <h1>Form Layout</h1>
        <p class="lead">Give your forms some structure—from inline to horizontal to custom grid implementations—with our form layout options</p>
        <hr />
    </div>

    <section class="mb-4" id="form-examples">
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Margin utilities</h2>
                    <div class="mb-3">
                        <Form.InputLabel for="formGroupExampleInput">Example label</Form.InputLabel>
                        <Form.TextInput id="formGroupExampleInput" placeholder="Example input placeholder" />
                    </div>
                    <div class="mb-3">
                        <Form.InputLabel for="formGroupExampleInput2">Another label</Form.InputLabel>
                        <Form.TextInput id="formGroupExampleInput2" placeholder="Another input placeholder" />
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<div class="mb-3">
    <Form.InputLabel for="formGroupExampleInput">Example label</Form.InputLabel>
    <Form.TextInput id="formGroupExampleInput" placeholder="Example input placeholder" />
</div>
<div class="mb-3">
    <Form.InputLabel for="formGroupExampleInput2">Another label</Form.InputLabel>
    <Form.TextInput id="formGroupExampleInput2" placeholder="Another input placeholder" />
</div>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Form grid</h2>
                    <div class="row">
                        <div class="col">
                            <Form.TextInput placeholder="First name" aria-label="First name" data-form-type="other" />
                        </div>
                        <div class="col">
                            <Form.TextInput placeholder="Last name" aria-label="Last name" data-form-type="other" />
                        </div>
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<div class="row">
    <div class="col">
        <Form.TextInput placeholder="First name" aria-label="First name" />
    </div>
    <div class="col">
        <Form.TextInput placeholder="Last name" aria-label="Last name" />
    </div>
</div>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Gutters</h2>
                    <div class="row g-3">
                        <div class="col">
                            <Form.TextInput placeholder="First name" aria-label="First name" />
                        </div>
                        <div class="col">
                            <Form.TextInput placeholder="Last name" aria-label="Last name" />
                        </div>
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<div class="row">
    <div class="col">
        <Form.TextInput placeholder="First name" aria-label="First name" />
    </div>
    <div class="col">
        <Form.TextInput placeholder="Last name" aria-label="Last name" />
    </div>
</div>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Complex layout</h2>
                    <form class="row g-3">
                        <div class="col-md-6">
                            <Form.InputLabel for="inputEmail4">Email</Form.InputLabel>
                            <Form.EmailInput id="inputEmail4" />
                        </div>
                        <div class="col-md-6">
                            <Form.InputLabel for="inputPassword4">Password</Form.InputLabel>
                            <Form.PasswordInput id="inputPassword4" />
                        </div>
                        <div class="col-12">
                            <Form.InputLabel for="inputAddress">Address</Form.InputLabel>
                            <Form.TextInput id="inputAddress" placeholder="1234 Main St" />
                        </div>
                        <div class="col-12">
                            <Form.InputLabel for="inputAddress2">Address 2</Form.InputLabel>
                            <Form.TextInput id="inputAddress2" placeholder="Apartment, studio, or floor" />
                        </div>
                        <div class="col-md-6">
                            <Form.InputLabel for="inputCity">City</Form.InputLabel>
                            <Form.TextInput id="inputCity" />
                        </div>
                        <div class="col-md-4">
                            <Form.InputLabel for="inputState">State</Form.InputLabel>
                            <Form.Select id="inputState">
                                <option selected>Choose...</option>
                                <option>...</option>
                            </Form.Select>
                        </div>
                        <div class="col-md-2">
                            <Form.InputLabel for="inputZip">Zip</Form.InputLabel>
                            <Form.TextInput id="inputZip" />
                        </div>
                        <div class="col-12">
                            <Form.Check>
                                <Form.CheckInput id="gridCheck" />
                                <Form.CheckLabel for="gridCheck">Check me out</Form.CheckLabel>
                            </Form.Check>
                        </div>
                        <div class="col-12">
                            <Button
                                colorVariant="primary"
                                type="submit"
                                onclick={(event: Event) => {
                                    event.preventDefault();
                                }}>Sign in</Button>
                        </div>
                    </form>
                </div>
                <SyntaxHighlighter
                    code={`<form class="row g-3">
    <div class="col-md-6">
        <Form.InputLabel for="inputEmail4">Email</Form.InputLabel>
        <Form.EmailInput id="inputEmail4" />
    </div>
    <div class="col-md-6">
        <Form.InputLabel for="inputPassword4">Password</Form.InputLabel>
        <Form.PasswordInput id="inputPassword4" />
    </div>
    <div class="col-12">
        <Form.InputLabel for="inputAddress">Address</Form.InputLabel>
        <Form.TextInput id="inputAddress" placeholder="1234 Main St" />
    </div>
    <div class="col-12">
        <Form.InputLabel for="inputAddress2">Address 2</Form.InputLabel>
        <Form.TextInput id="inputAddress2" placeholder="Apartment, studio, or floor" />
    </div>
    <div class="col-md-6">
        <Form.InputLabel for="inputCity">City</Form.InputLabel>
        <Form.TextInput id="inputCity" />
    </div>
    <div class="col-md-4">
        <Form.InputLabel for="inputState">State</Form.InputLabel>
        <Form.Select id="inputState">
            <option selected>Choose...</option>
            <option>...</option>
        </Form.Select>
    </div>
    <div class="col-md-2">
        <Form.InputLabel for="inputZip">Zip</Form.InputLabel>
        <Form.TextInput id="inputZip" />
    </div>
    <div class="col-12">
        <Form.Check>
            <Form.CheckInput id="gridCheck" />
            <Form.CheckLabel for="gridCheck">Check me out</Form.CheckLabel>
        </Form.Check>
    </div>
    <div class="col-12">
        <Button colorVariant="primary" type="submit">Sign in</Button>
    </div>
</form>`} />
            </div>
        </div>
    </section>
</div>
