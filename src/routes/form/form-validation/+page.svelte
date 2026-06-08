<script lang="ts">
    import { Button, Form } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    let wasFormValidated = $state(false);
    let wasFormValidated2 = $state(false);
</script>

<div>
    <div class="mb-4">
        <h1>Form Validation</h1>
        <p class="lead">
            Provide valuable, actionable feedback to your users with HTML5 form validation, via browser default behaviors or custom styles.
        </p>
        <hr />
    </div>

    <section class="mb-4" id="form-validation-examples">
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Custom styles</h2>
                    <Form.Root class="row g-3" needsValidation novalidate wasValidated={wasFormValidated}>
                        <div class="col-md-4">
                            <Form.InputLabel for="validationCustom01">First name</Form.InputLabel>
                            <Form.TextInput id="validationCustom01" value="Mark" required />
                            <Form.Feedback isValid>Looks good!</Form.Feedback>
                        </div>
                        <div class="col-md-4">
                            <Form.InputLabel for="validationCustom02">Last name</Form.InputLabel>
                            <Form.TextInput id="validationCustom02" value="Otto" required />
                            <Form.Feedback isValid>Looks good!</Form.Feedback>
                        </div>
                        <div class="col-md-4">
                            <Form.InputLabel for="validationCustomUsername">Username</Form.InputLabel>
                            <Form.InputGroup hasValidation>
                                <Form.InputGroupText id="inputGroupPrepend">@</Form.InputGroupText>
                                <Form.TextInput id="validationCustomUsername" aria-describedby="inputGroupPrepend" required />
                                <Form.Feedback isInvalid>Please choose a username.</Form.Feedback>
                            </Form.InputGroup>
                        </div>
                        <div class="col-md-6">
                            <Form.InputLabel for="validationCustom03">City</Form.InputLabel>
                            <Form.TextInput id="validationCustom03" required />
                            <Form.Feedback isInvalid>Please provide a valid city.</Form.Feedback>
                        </div>
                        <div class="col-md-3">
                            <Form.InputLabel for="validationCustom04">State</Form.InputLabel>
                            <Form.Select id="validationCustom04" required>
                                <option selected disabled value="">Choose...</option>
                                <option>...</option>
                            </Form.Select>
                            <Form.Feedback isInvalid>Please select a valid state.</Form.Feedback>
                        </div>
                        <div class="col-md-3">
                            <Form.InputLabel for="validationCustom05">Zip</Form.InputLabel>
                            <Form.TextInput id="validationCustom05" required />
                            <Form.Feedback isInvalid>Please provide a valid zip.</Form.Feedback>
                        </div>
                        <div class="col-12">
                            <Form.Check>
                                <Form.CheckInput value="" id="invalidCheck" required />
                                <Form.CheckLabel for="invalidCheck">Agree to terms and conditions</Form.CheckLabel>
                                <Form.Feedback isInvalid>You must agree before submitting.</Form.Feedback>
                            </Form.Check>
                        </div>
                        <div class="col-12">
                            <Button
                                colorVariant="primary"
                                type="submit"
                                onclick={(event: Event) => {
                                    event.preventDefault();
                                    wasFormValidated = true;
                                }}
                                >Submit form
                            </Button>
                            <Button
                                colorVariant="outline-secondary"
                                type="reset"
                                onclick={(event: Event) => {
                                    event.preventDefault();
                                    wasFormValidated = false;
                                }}
                                >Reset form
                            </Button>
                        </div>
                    </Form.Root>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let wasFormValidated = $state(false);
\u003c/script>
<Form.Root class="row g-3" needsValidation novalidate wasValidated={wasFormValidated}>
    <div class="col-md-4">
        <Form.InputLabel for="validationCustom01">First name</Form.InputLabel>
        <Form.TextInput id="validationCustom01" value="Mark" required />
        <Form.Feedback isValid>Looks good!</Form.Feedback>
    </div>
    <div class="col-md-4">
        <Form.InputLabel for="validationCustom02">Last name</Form.InputLabel>
        <Form.TextInput id="validationCustom02" value="Otto" required />
        <Form.Feedback isValid>Looks good!</Form.Feedback>
    </div>
    <div class="col-md-4">
        <Form.InputLabel for="validationCustomUsername">Username</Form.InputLabel>
        <Form.InputGroup hasValidation>
            <Form.InputGroupText id="inputGroupPrepend">@</Form.InputGroupText>
            <Form.TextInput id="validationCustomUsername" aria-describedby="inputGroupPrepend" required />
            <Form.Feedback isInvalid>Please choose a username.</Form.Feedback>
        </Form.InputGroup>
    </div>
    <div class="col-md-6">
        <Form.InputLabel for="validationCustom03">City</Form.InputLabel>
        <Form.TextInput id="validationCustom03" required />
        <Form.Feedback isInvalid>Please provide a valid city.</Form.Feedback>
    </div>
    <div class="col-md-3">
        <Form.InputLabel for="validationCustom04">State</Form.InputLabel>
        <Form.Select id="validationCustom04" required>
            <option selected disabled value="">Choose...</option>
            <option>...</option>
        </Form.Select>
        <Form.Feedback isInvalid>Please select a valid state.</Form.Feedback>
    </div>
    <div class="col-md-3">
        <Form.InputLabel for="validationCustom05">Zip</Form.InputLabel>
        <Form.TextInput id="validationCustom05" required />
        <Form.Feedback isInvalid>Please provide a valid zip.</Form.Feedback>
    </div>
    <div class="col-12">
        <Form.Check>
            <Form.CheckInput value="" id="invalidCheck" required />
            <Form.CheckLabel for="invalidCheck">Agree to terms and conditions</Form.CheckLabel>
            <Form.Feedback isInvalid>You must agree before submitting.</Form.Feedback>
        </Form.Check>
    </div>
    <div class="col-12">
        <Button
            colorVariant="primary"
            type="submit"
            onclick={(event: Event) => {
                event.preventDefault();
                wasFormValidated = true;
            }}
            >Submit form
        </Button>
        <Button
            colorVariant="outline-secondary"
            type="reset"
            onclick={(event: Event) => {
                event.preventDefault();
                wasFormValidated = false;
            }}
            >Reset form
        </Button>
    </div>
</Form.Root>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Browser defaults</h2>

                    <Form.Root class="row g-3">
                        <div class="col-md-4">
                            <Form.InputLabel for="validationDefault01">First name</Form.InputLabel>
                            <Form.TextInput id="validationDefault01" value="Mark" required />
                        </div>
                        <div class="col-md-4">
                            <Form.InputLabel for="validationDefault02">Last name</Form.InputLabel>
                            <Form.TextInput id="validationDefault02" value="Otto" required />
                        </div>
                        <div class="col-md-4">
                            <Form.InputLabel for="validationDefaultUsername">Username</Form.InputLabel>
                            <Form.InputGroup>
                                <Form.InputGroupText id="inputGroupPrepend2">@</Form.InputGroupText>
                                <Form.TextInput id="validationDefaultUsername" aria-describedby="inputGroupPrepend2" required />
                            </Form.InputGroup>
                        </div>
                        <div class="col-md-6">
                            <Form.InputLabel for="validationDefault03">City</Form.InputLabel>
                            <Form.TextInput id="validationDefault03" required />
                        </div>
                        <div class="col-md-3">
                            <Form.InputLabel for="validationDefault04">State</Form.InputLabel>
                            <Form.Select id="validationDefault04" required>
                                <option selected disabled value="">Choose...</option>
                                <option>...</option>
                            </Form.Select>
                        </div>
                        <div class="col-md-3">
                            <Form.InputLabel for="validationDefault05">Zip</Form.InputLabel>
                            <Form.TextInput id="validationDefault05" required />
                        </div>
                        <div class="col-12">
                            <div class="form-check">
                                <Form.CheckInput value="" id="invalidCheck2" required />
                                <Form.CheckLabel for="invalidCheck2">Agree to terms and conditions</Form.CheckLabel>
                            </div>
                        </div>
                        <div class="col-12">
                            <Button colorVariant="primary" type="submit">Submit form</Button>
                            <Button colorVariant="outline-secondary" type="reset">Reset form</Button>
                        </div>
                    </Form.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Form.Root class="row g-3">
    <div class="col-md-4">
        <Form.InputLabel for="validationDefault01">First name</Form.InputLabel>
        <Form.TextInput id="validationDefault01" value="Mark" required />
    </div>
    <div class="col-md-4">
        <Form.InputLabel for="validationDefault02">Last name</Form.InputLabel>
        <Form.TextInput id="validationDefault02" value="Otto" required />
    </div>
    <div class="col-md-4">
        <Form.InputLabel for="validationDefaultUsername">Username</Form.InputLabel>
        <Form.InputGroup>
            <Form.InputGroupText id="inputGroupPrepend2">@</Form.InputGroupText>
            <Form.TextInput id="validationDefaultUsername" aria-describedby="inputGroupPrepend2" required />
        </Form.InputGroup>
    </div>
    <div class="col-md-6">
        <Form.InputLabel for="validationDefault03">City</Form.InputLabel>
        <Form.TextInput id="validationDefault03" required />
    </div>
    <div class="col-md-3">
        <Form.InputLabel for="validationDefault04">State</Form.InputLabel>
        <Form.Select id="validationDefault04" required>
            <option selected disabled value="">Choose...</option>
            <option>...</option>
        </Form.Select>
    </div>
    <div class="col-md-3">
        <Form.InputLabel for="validationDefault05">Zip</Form.InputLabel>
        <Form.TextInput id="validationDefault05" required />
    </div>
    <div class="col-12">
        <div class="form-check">
            <Form.CheckInput value="" id="invalidCheck2" required />
            <Form.CheckLabel for="invalidCheck2">Agree to terms and conditions</Form.CheckLabel>
        </div>
    </div>
    <div class="col-12">
        <Button colorVariant="primary" type="submit">Submit form</Button>
        <Button colorVariant="outline-secondary" type="reset">Reset form</Button>
    </div>
</Form.Root>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Server-side</h2>

                    <Form.Root class="row g-3">
                        <div class="col-md-4">
                            <Form.InputLabel for="validationServer01">First name</Form.InputLabel>
                            <Form.TextInput isValid id="validationServer01" value="Mark" required />
                            <Form.Feedback isValid>Looks good!</Form.Feedback>
                        </div>
                        <div class="col-md-4">
                            <Form.InputLabel for="validationServer02">Last name</Form.InputLabel>
                            <Form.TextInput isValid id="validationServer02" value="Otto" required />
                            <Form.Feedback isValid>Looks good!</Form.Feedback>
                        </div>
                        <div class="col-md-4">
                            <Form.InputLabel for="validationServerUsername">Username</Form.InputLabel>
                            <Form.InputGroup hasValidation>
                                <Form.InputGroupText id="inputGroupPrepend3">@</Form.InputGroupText>
                                <Form.TextInput
                                    isInvalid
                                    id="validationServerUsername"
                                    aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback"
                                    required />
                                <Form.Feedback id="validationServerUsernameFeedback" isInvalid>Please choose a username.</Form.Feedback>
                            </Form.InputGroup>
                        </div>
                        <div class="col-md-6">
                            <Form.InputLabel for="validationServer03">City</Form.InputLabel>
                            <Form.TextInput isInvalid id="validationServer03" aria-describedby="validationServer03Feedback" required />
                            <Form.Feedback id="validationServer03Feedback" isInvalid>Please provide a valid city.</Form.Feedback>
                        </div>
                        <div class="col-md-3">
                            <Form.InputLabel for="validationServer04">State</Form.InputLabel>
                            <Form.Select isInvalid id="validationServer04" aria-describedby="validationServer04Feedback" required>
                                <option selected disabled value="">Choose...</option>
                                <option>...</option>
                            </Form.Select>
                            <Form.Feedback id="validationServer04Feedback" isInvalid>Please select a valid state.</Form.Feedback>
                        </div>
                        <div class="col-md-3">
                            <Form.InputLabel for="validationServer05">Zip</Form.InputLabel>
                            <Form.TextInput isInvalid id="validationServer05" aria-describedby="validationServer05Feedback" required />
                            <Form.Feedback id="validationServer05Feedback" isInvalid>Please provide a valid zip.</Form.Feedback>
                        </div>
                        <div class="col-12">
                            <Form.Check>
                                <Form.CheckInput isInvalid value="" id="invalidCheck3" aria-describedby="invalidCheck3Feedback" required />
                                <Form.CheckLabel for="invalidCheck3">Agree to terms and conditions</Form.CheckLabel>
                                <Form.Feedback id="invalidCheck3Feedback" isInvalid>You must agree before submitting.</Form.Feedback>
                            </Form.Check>
                        </div>
                        <div class="col-12">
                            <Button
                                colorVariant="primary"
                                type="submit"
                                onclick={(event: Event) => {
                                    event.preventDefault();
                                }}
                                >Submit form
                            </Button>
                        </div>
                    </Form.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Form.Root class="row g-3">
    <div class="col-md-4">
        <Form.InputLabel for="validationServer01">First name</Form.InputLabel>
        <Form.TextInput isValid id="validationServer01" value="Mark" required />
        <Form.Feedback isValid>Looks good!</Form.Feedback>
    </div>
    <div class="col-md-4">
        <Form.InputLabel for="validationServer02">Last name</Form.InputLabel>
        <Form.TextInput isValid id="validationServer02" value="Otto" required />
        <Form.Feedback isValid>Looks good!</Form.Feedback>
    </div>
    <div class="col-md-4">
        <Form.InputLabel for="validationServerUsername">Username</Form.InputLabel>
        <Form.InputGroup hasValidation>
            <Form.InputGroupText id="inputGroupPrepend3">@</Form.InputGroupText>
            <Form.TextInput
                isInvalid
                id="validationServerUsername"
                aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback"
                required />
            <Form.Feedback id="validationServerUsernameFeedback" isInvalid>Please choose a username.</Form.Feedback>
        </Form.InputGroup>
    </div>
    <div class="col-md-6">
        <Form.InputLabel for="validationServer03">City</Form.InputLabel>
        <Form.TextInput isInvalid id="validationServer03" aria-describedby="validationServer03Feedback" required />
        <Form.Feedback id="validationServer03Feedback" isInvalid>Please provide a valid city.</Form.Feedback>
    </div>
    <div class="col-md-3">
        <Form.InputLabel for="validationServer04">State</Form.InputLabel>
        <Form.Select isInvalid id="validationServer04" aria-describedby="validationServer04Feedback" required>
            <option selected disabled value="">Choose...</option>
            <option>...</option>
        </Form.Select>
        <Form.Feedback id="validationServer04Feedback" isInvalid>Please select a valid state.</Form.Feedback>
    </div>
    <div class="col-md-3">
        <Form.InputLabel for="validationServer05">Zip</Form.InputLabel>
        <Form.TextInput isInvalid id="validationServer05" aria-describedby="validationServer05Feedback" required />
        <Form.Feedback id="validationServer05Feedback" isInvalid>Please provide a valid zip.</Form.Feedback>
    </div>
    <div class="col-12">
        <Form.Check>
            <Form.CheckInput isInvalid value="" id="invalidCheck3" aria-describedby="invalidCheck3Feedback" required />
            <Form.CheckLabel for="invalidCheck3">Agree to terms and conditions</Form.CheckLabel>
            <Form.Feedback id="invalidCheck3Feedback" isInvalid>You must agree before submitting.</Form.Feedback>
        </Form.Check>
    </div>
    <div class="col-12">
        <Button
            colorVariant="primary"
            type="submit"
            onclick={(event: Event) => {
                event.preventDefault();
            }}
            >Submit form
        </Button>
    </div>
</Form.Root>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Supported elements</h2>
                    <p>Validation styles are available for the following form controls and components:</p>

                    <Form.Root wasValidated>
                        <div class="mb-3">
                            <Form.InputLabel for="validationTextarea">Textarea</Form.InputLabel>
                            <Form.TextArea id="validationTextarea" placeholder="Required example textarea" required></Form.TextArea>
                            <Form.Feedback isInvalid>Please enter a message in the textarea.</Form.Feedback>
                        </div>
                        <div class="form-check mb-3">
                            <Form.CheckInput id="validationFormCheck1" required />
                            <Form.CheckLabel class="form-check-label" for="validationFormCheck1">Check this checkbox</Form.CheckLabel>
                            <Form.Feedback isInvalid>Example invalid feedback text</Form.Feedback>
                        </div>
                        <div class="form-check">
                            <Form.RadioInput id="validationFormCheck2" name="radio-stacked" required />
                            <Form.CheckLabel class="form-check-label" for="validationFormCheck2">Toggle this radio</Form.CheckLabel>
                        </div>
                        <div class="form-check mb-3">
                            <Form.RadioInput id="validationFormCheck3" name="radio-stacked" required />
                            <Form.CheckLabel class="form-check-label" for="validationFormCheck3">Or toggle this other radio</Form.CheckLabel>
                            <Form.Feedback isInvalid>More example invalid feedback text</Form.Feedback>
                        </div>
                        <div class="mb-3">
                            <Form.Select required aria-label="select example">
                                <option value="">Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                            <Form.Feedback isInvalid>Example invalid select feedback</Form.Feedback>
                        </div>
                        <div class="mb-3">
                            <Form.FileInput aria-label="file example" required />
                            <Form.Feedback isInvalid>Example invalid form file feedback</Form.Feedback>
                        </div>
                        <div class="mb-3">
                            <Button colorVariant="primary" type="submit" disabled>Submit form</Button>
                        </div>
                    </Form.Root>
                </div>
                <SyntaxHighlighter
                    code={`<Form.Root wasValidated>
    <div class="mb-3">
        <Form.InputLabel for="validationTextarea">Textarea</Form.InputLabel>
        <Form.TextArea id="validationTextarea" placeholder="Required example textarea" required></Form.TextArea>
        <Form.Feedback isInvalid>Please enter a message in the textarea.</Form.Feedback>
    </div>
    <div class="form-check mb-3">
        <Form.CheckInput id="validationFormCheck1" required />
        <Form.CheckLabel class="form-check-label" for="validationFormCheck1">Check this checkbox</Form.CheckLabel>
        <Form.Feedback isInvalid>Example invalid feedback text</Form.Feedback>
    </div>
    <div class="form-check">
        <Form.RadioInput id="validationFormCheck2" name="radio-stacked" required />
        <Form.CheckLabel class="form-check-label" for="validationFormCheck2">Toggle this radio</Form.CheckLabel>
    </div>
    <div class="form-check mb-3">
        <Form.RadioInput id="validationFormCheck3" name="radio-stacked" required />
        <Form.CheckLabel class="form-check-label" for="validationFormCheck3">Or toggle this other radio</Form.CheckLabel>
        <Form.Feedback isInvalid>More example invalid feedback text</Form.Feedback>
    </div>
    <div class="mb-3">
        <Form.Select required aria-label="select example">
            <option value="">Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
        </Form.Select>
        <Form.Feedback isInvalid>Example invalid select feedback</Form.Feedback>
    </div>
    <div class="mb-3">
        <Form.FileInput aria-label="file example" required />
        <Form.Feedback isInvalid>Example invalid form file feedback</Form.Feedback>
    </div>
    <div class="mb-3">
        <Button colorVariant="primary" type="submit" disabled>Submit form</Button>
    </div>
</Form.Root>`} />
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <h2 class="wk-quick-link mb-3">Tooltips</h2>
                    <p>
                        Display validation feedback in a styled tooltip. Be sure to have a parent with <code>position: relative</code> on it for tooltip
                        positioning.
                    </p>

                    <Form.Root class="row g-3" needsValidation novalidate wasValidated={wasFormValidated2}>
                        <div class="col-md-4 position-relative">
                            <Form.InputLabel for="validationTooltip01">First name</Form.InputLabel>
                            <Form.TextInput id="validationTooltip01" value="Mark" required />
                            <Form.Feedback isValid isTooltip>Looks good!</Form.Feedback>
                        </div>
                        <div class="col-md-4 position-relative">
                            <Form.InputLabel for="validationTooltip02">Last name</Form.InputLabel>
                            <Form.TextInput id="validationTooltip02" value="Otto" required />
                            <Form.Feedback isValid isTooltip>Looks good!</Form.Feedback>
                        </div>
                        <div class="col-md-4 position-relative">
                            <Form.InputLabel for="validationTooltipUsername">Username</Form.InputLabel>
                            <Form.InputGroup hasValidation>
                                <Form.InputGroupText id="validationTooltipUsernamePrepend">@</Form.InputGroupText>
                                <Form.TextInput id="validationTooltipUsername" aria-describedby="validationTooltipUsernamePrepend" required />
                                <Form.Feedback isInvalid isTooltip>Please choose a unique and valid username.</Form.Feedback>
                            </Form.InputGroup>
                        </div>
                        <div class="col-md-6 position-relative">
                            <Form.InputLabel for="validationTooltip03">City</Form.InputLabel>
                            <Form.TextInput id="validationTooltip03" required />
                            <Form.Feedback isInvalid isTooltip>Please provide a valid city.</Form.Feedback>
                        </div>
                        <div class="col-md-3 position-relative">
                            <Form.InputLabel for="validationTooltip04">State</Form.InputLabel>
                            <select class="form-select" id="validationTooltip04" required>
                                <option selected disabled value="">Choose...</option>
                                <option>...</option>
                            </select>
                            <Form.Feedback isInvalid isTooltip>Please select a valid state.</Form.Feedback>
                        </div>
                        <div class="col-md-3 position-relative">
                            <Form.InputLabel for="validationTooltip05">Zip</Form.InputLabel>
                            <Form.TextInput id="validationTooltip05" required />
                            <Form.Feedback isInvalid isTooltip>Please provide a valid zip.</Form.Feedback>
                        </div>
                        <div class="col-12">
                            <Button
                                colorVariant="primary"
                                type="submit"
                                onclick={(event: Event) => {
                                    event.preventDefault();
                                    wasFormValidated2 = true;
                                }}
                                >Submit form
                            </Button>
                            <Button
                                colorVariant="outline-secondary"
                                type="reset"
                                onclick={(event: Event) => {
                                    event.preventDefault();
                                    wasFormValidated2 = false;
                                }}
                                >Reset form
                            </Button>
                        </div>
                    </Form.Root>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let wasFormValidated2 = $state(false);
\u003c/script>
<Form.Root class="row g-3" needsValidation novalidate wasValidated={wasFormValidated2}>
    <div class="col-md-4 position-relative">
        <Form.InputLabel for="validationTooltip01">First name</Form.InputLabel>
        <Form.TextInput id="validationTooltip01" value="Mark" required />
        <Form.Feedback isValid isTooltip>Looks good!</Form.Feedback>
    </div>
    <div class="col-md-4 position-relative">
        <Form.InputLabel for="validationTooltip02">Last name</Form.InputLabel>
        <Form.TextInput id="validationTooltip02" value="Otto" required />
        <Form.Feedback isValid isTooltip>Looks good!</Form.Feedback>
    </div>
    <div class="col-md-4 position-relative">
        <Form.InputLabel for="validationTooltipUsername">Username</Form.InputLabel>
        <Form.InputGroup hasValidation>
            <Form.InputGroupText id="validationTooltipUsernamePrepend">@</Form.InputGroupText>
            <Form.TextInput id="validationTooltipUsername" aria-describedby="validationTooltipUsernamePrepend" required />
            <Form.Feedback isInvalid isTooltip>Please choose a unique and valid username.</Form.Feedback>
        </Form.InputGroup>
    </div>
    <div class="col-md-6 position-relative">
        <Form.InputLabel for="validationTooltip03">City</Form.InputLabel>
        <Form.TextInput id="validationTooltip03" required />
        <Form.Feedback isInvalid isTooltip>Please provide a valid city.</Form.Feedback>
    </div>
    <div class="col-md-3 position-relative">
        <Form.InputLabel for="validationTooltip04">State</Form.InputLabel>
        <select class="form-select" id="validationTooltip04" required>
            <option selected disabled value="">Choose...</option>
            <option>...</option>
        </select>
        <Form.Feedback isInvalid isTooltip>Please select a valid state.</Form.Feedback>
    </div>
    <div class="col-md-3 position-relative">
        <Form.InputLabel for="validationTooltip05">Zip</Form.InputLabel>
        <Form.TextInput id="validationTooltip05" required />
        <Form.Feedback isInvalid isTooltip>Please provide a valid zip.</Form.Feedback>
    </div>
    <div class="col-12">
        <Button
            colorVariant="primary"
            type="submit"
            onclick={(event: Event) => {
                event.preventDefault();
                wasFormValidated2 = true;
            }}
            >Submit form
        </Button>
        <Button
            colorVariant="outline-secondary"
            type="reset"
            onclick={(event: Event) => {
                event.preventDefault();
                wasFormValidated2 = false;
            }}
            >Reset form
        </Button>
    </div>
</Form.Root>`} />
            </div>
        </div>
    </section>
</div>
