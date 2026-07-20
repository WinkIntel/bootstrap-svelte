<script lang="ts">
    import { ButtonCheck, Form } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    let buttonCheckCheckedValue: boolean = $state(false);
    let buttonCheckCheckboxGroupValues: string[] = $state([]);
    let buttonCheckRadioGroupValue: string = $state('option1');
    let checkedValue: boolean = $state(false);
    let checkGroupValues: string[] = $state([]);
    let colorInputValue: string = $state('#563d7c');
    let dateInputValue: string = $state('2025-06-10');
    let datetimeLocalInputValue: string = $state('2025-06-10T19:30');
    let emailInputValue: string = $state('');
    let fileInputValue: FileList | null = $state(null);
    let hiddenInputValue: string = $state('Nothing to see here as well');
    let monthInputValue: string = $state('2025-06');
    let numberInputValue: number = $state(1);
    let passwordInputValue: string = $state('myP@55w0rd');
    let showPassword: boolean = $state(false);
    let radioValue: string = $state('');
    let rangeInputValue: number = $state(1);
    let searchInputValue: string = $state('search value');
    let selectValue: string = $state('');
    let switchInputValue: boolean = $state(false);
    let telephoneInputValue: string = $state('555-867-5309');
    let telephoneInputMaskedValue: string = $state('');
    let telephoneInputMaskedArrayValue: string = $state('');
    let textAreaValue: string = $state('textarea value');
    let textInputValue: string = $state('text value');
    let timeInputValue: string = $state('07:32');
    let urlInputValue: string = $state('https://example.com');
    let weekInputValue: string = $state('2025-W07');
</script>

<div>
    <div class="mb-4">
        <h1>Form Controls</h1>
        <p class="lead">
            Give textual form controls like <code>&lt;input&gt;</code>s and <code>&lt;textarea&gt;</code>s an upgrade with custom styles, sizing,
            focus states, and more.
        </p>
        <hr />
    </div>

    <section class="mb-4" id="accessibility">
        <h2 class="wk-quick-link mb-3">Accessibility</h2>
        <ul>
            <li>Pair every visible control with <code>Form.InputLabel</code>, <code>Form.CheckLabel</code>, or an equivalent accessible label.</li>
            <li>Use helper text for accepted file types, formatting requirements, and validation expectations.</li>
            <li>Avoid relying on <code>title</code> or placeholder text as the only accessible name.</li>
            <li>Check contrast for button-style form controls when using light outline variants on white backgrounds.</li>
        </ul>
    </section>

    <section class="mb-4" id="control-examples">
        <h2 class="wk-quick-link mb-3">ButtonCheck Inputs</h2>
        <p>Use <code>ButtonCheck</code> to bind checkbox and radio toggle inputs.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <ButtonCheck colorVariant="outline-primary" id="btnCheckDefault" value="default">Default</ButtonCheck>
                    <ButtonCheck checked colorVariant="outline-primary" id="btnCheckChecked" value="checked">Checked</ButtonCheck>
                    <ButtonCheck disabled colorVariant="outline-primary" id="btnCheckDisabled" value="disabled">Disabled</ButtonCheck>
                    <hr />
                    <div>Bounded checked value</div>
                    <ButtonCheck bind:checked={buttonCheckCheckedValue} colorVariant="outline-success" id="btnCheckBounded" value="bound"
                        >Toggle checked state</ButtonCheck>
                    <span>Output:</span>&nbsp;<code>{buttonCheckCheckedValue}</code>
                    <hr />
                    <div>Bounded checkbox group values</div>
                    <ButtonCheck bind:group={buttonCheckCheckboxGroupValues} colorVariant="outline-secondary" id="btnGroupCheck1" value="option1"
                        >Option 1</ButtonCheck>
                    <ButtonCheck bind:group={buttonCheckCheckboxGroupValues} colorVariant="outline-secondary" id="btnGroupCheck2" value="option2"
                        >Option 2</ButtonCheck>
                    <span>Output:</span>&nbsp;<code>{buttonCheckCheckboxGroupValues}</code>
                    <hr />
                    <div>Bounded radio group value</div>
                    <ButtonCheck
                        bind:group={buttonCheckRadioGroupValue}
                        colorVariant="outline-secondary"
                        id="btnGroupRadio1"
                        name="btnGroupRadio"
                        type="radio"
                        value="option1">Option 1</ButtonCheck>
                    <ButtonCheck
                        bind:group={buttonCheckRadioGroupValue}
                        colorVariant="outline-secondary"
                        id="btnGroupRadio2"
                        name="btnGroupRadio"
                        type="radio"
                        value="option2">Option 2</ButtonCheck>
                    <span>Output:</span>&nbsp;<code>{buttonCheckRadioGroupValue}</code>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let buttonCheckCheckedValue: boolean = $state(false);
    let buttonCheckCheckboxGroupValues: string[] = $state([]);
    let buttonCheckRadioGroupValue: string = $state('option1');
\u003c/script>

<ButtonCheck colorVariant="outline-primary" id="btnCheckDefault" value="default">Default</ButtonCheck>
<ButtonCheck checked colorVariant="outline-primary" id="btnCheckChecked" value="checked">Checked</ButtonCheck>
<ButtonCheck disabled colorVariant="outline-primary" id="btnCheckDisabled" value="disabled">Disabled</ButtonCheck>

<hr/>

<ButtonCheck bind:checked={buttonCheckCheckedValue} colorVariant="outline-success" id="btnCheckBounded" value="bound">
    Toggle checked state
</ButtonCheck>
<span>Output:</span>&nbsp;<code>{buttonCheckCheckedValue}</code>

<hr/>

<ButtonCheck bind:group={buttonCheckCheckboxGroupValues} colorVariant="outline-secondary" id="btnGroupCheck1" value="option1">
    Option 1
</ButtonCheck>
<ButtonCheck bind:group={buttonCheckCheckboxGroupValues} colorVariant="outline-secondary" id="btnGroupCheck2" value="option2">
    Option 2
</ButtonCheck>
<span>Output:</span>&nbsp;<code>{buttonCheckCheckboxGroupValues}</code>

<hr/>

<ButtonCheck bind:group={buttonCheckRadioGroupValue} colorVariant="outline-secondary" id="btnGroupRadio1" name="btnGroupRadio" type="radio" value="option1">
    Option 1
</ButtonCheck>
<ButtonCheck bind:group={buttonCheckRadioGroupValue} colorVariant="outline-secondary" id="btnGroupRadio2" name="btnGroupRadio" type="radio" value="option2">
    Option 2
</ButtonCheck>
<span>Output:</span>&nbsp;<code>{buttonCheckRadioGroupValue}</code>`} />
            </div>
        </div>

        <h2 class="wk-quick-link mb-3">Checkbox Input</h2>
        <p>⚠️ Readonly and plaintext are not supported.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.Check>
                        <Form.CheckInput id="checkDefault" name="checkDefault" value="" />
                        <Form.CheckLabel for="checkDefault">Default checkbox</Form.CheckLabel>
                    </Form.Check>
                    <Form.Check>
                        <Form.CheckInput checked id="checkChecked" name="checkChecked" value="" />
                        <Form.CheckLabel for="checkChecked">Checked checkbox</Form.CheckLabel>
                    </Form.Check>
                    <Form.Check>
                        <Form.CheckInput disabled id="checkDisabled" name="checkDisabled" value="" />
                        <Form.CheckLabel for="checkDisabled">Disabled checkbox</Form.CheckLabel>
                    </Form.Check>
                    <Form.Check>
                        <Form.CheckInput checked disabled id="checkDisabledChecked" name="checkDisabledChecked" value="" />
                        <Form.CheckLabel for="checkDisabledChecked">Disabled checked checkbox</Form.CheckLabel>
                    </Form.Check>
                    <Form.Check>
                        <Form.CheckInput id="checkReadonly" isIndeterminate={true} name="checkReadonly" value="" />
                        <Form.CheckLabel for="checkReadonly"
                            >Indeterminate checkbox (<a href="https://www.w3schools.com/jsref/prop_checkbox_indeterminate.asp" target="_blank"
                                >via JavaScript</a
                            >)</Form.CheckLabel>
                    </Form.Check>
                    <hr />
                    <Form.Check>
                        <Form.CheckInput bind:checked={checkedValue} id="checkBounded" name="checkBounded" />
                        <Form.CheckLabel for="checkBounded">Bounded checked value</Form.CheckLabel>
                    </Form.Check>
                    <span>Output:</span>&nbsp;<code>{checkedValue}</code>
                    <hr />
                    <div>Bounded group values</div>
                    <Form.Check isInline>
                        <Form.CheckInput bind:group={checkGroupValues} id="groupBounded1" name="groupBounded" value="option1" />
                        <Form.CheckLabel for="groupBounded1">Option 1</Form.CheckLabel>
                    </Form.Check>
                    <Form.Check isInline>
                        <Form.CheckInput bind:group={checkGroupValues} id="groupBounded2" name="groupBounded" value="option2" />
                        <Form.CheckLabel for="groupBounded2">Option 2</Form.CheckLabel>
                    </Form.Check>
                    <span>Output:</span>&nbsp;<code>{checkGroupValues}</code>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let checkedValue: boolean = $state(false);
    let checkGroupValues: string[] = $state([]);
\u003c/script>
<Form.Check><!-- Default -->
    <Form.CheckInput id="checkDefault" name="checkDefault" value="" />
    <Form.CheckLabel for="checkDefault">Default checkbox</Form.CheckLabel>
</Form.Check>
<Form.Check><!-- Checked -->
    <Form.CheckInput checked id="checkChecked" name="checkChecked" value="" />
    <Form.CheckLabel for="checkChecked">Checked checkbox</Form.CheckLabel>
</Form.Check>
<Form.Check><!-- Disabled -->
    <Form.CheckInput disabled id="checkDisabled" name="checkDisabled" value="" />
    <Form.CheckLabel for="checkDisabled">Disabled checkbox</Form.CheckLabel>
</Form.Check>
<Form.Check><!-- Disabled checked -->
    <Form.CheckInput checked disabled id="checkDisabledChecked" name="checkDisabledChecked" value="" />
    <Form.CheckLabel for="checkDisabledChecked">Disabled checked checkbox</Form.CheckLabel>
</Form.Check>
<Form.Check><!-- Indeterminate checkbox -->
    <Form.CheckInput id="checkReadonly" isIndeterminate={true} name="checkReadonly" value="" />
    <Form.CheckLabel for="checkReadonly">Indeterminate checkbox (via JavaScript)</Form.CheckLabel>
</Form.Check>
<hr/>
<Form.Check><!-- Checked bounded value -->
    <Form.CheckInput bind:checked={checkedValue} id="checkBounded" name="checkBounded" />
    <Form.CheckLabel for="checkBounded">Checked bounded value</Form.CheckLabel>
</Form.Check>
<span>Output:</span>&nbsp;<code>{checkedValue}</code>
<hr/>
<Form.Check isInline>
    <Form.CheckInput bind:group={checkGroupValues} id="groupBounded1" name="groupBounded" value="option1" />
    <Form.CheckLabel for="groupBounded1">Option 1</Form.CheckLabel>
</Form.Check>
<Form.Check isInline>
    <Form.CheckInput bind:group={checkGroupValues} id="groupBounded2" name="groupBounded" value="option2" />
    <Form.CheckLabel for="groupBounded2">Option 2</Form.CheckLabel>
</Form.Check>
<span>Output:</span>&nbsp;<code>{checkGroupValues}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Color Input</h2>
        <p>⚠️ Readonly and plaintext are not supported.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <div class="wk-control-stack">
                        <div>
                            <Form.InputLabel for="colorDefault">Default color</Form.InputLabel>
                            <Form.ColorInput id="colorDefault" value="#563d7c" />
                        </div>
                        <div>
                            <Form.InputLabel for="colorDisabled">Disabled color</Form.InputLabel>
                            <Form.ColorInput id="colorDisabled" disabled value="#563d7c" />
                        </div>
                        <div>
                            <Form.InputLabel for="colorSmall">Small color</Form.InputLabel>
                            <Form.ColorInput id="colorSmall" sizing="sm" value="#563d7c" />
                        </div>
                        <div>
                            <Form.InputLabel for="colorLarge">Large color</Form.InputLabel>
                            <Form.ColorInput id="colorLarge" sizing="lg" value="#563d7c" />
                        </div>
                        <div>
                            <Form.InputLabel for="colorBound">Bound color</Form.InputLabel>
                            <Form.ColorInput id="colorBound" bind:value={colorInputValue} />
                            <span>Output:</span>&nbsp;<code>{colorInputValue}</code>
                        </div>
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let colorInputValue: string = $state("#563d7c");
\u003c/script>
<Form.InputLabel for="colorDefault">Default color</Form.InputLabel>
<Form.ColorInput id="colorDefault" value="#563d7c" />

<Form.InputLabel for="colorDisabled">Disabled color</Form.InputLabel>
<Form.ColorInput id="colorDisabled" disabled value="#563d7c" />

<Form.InputLabel for="colorSmall">Small color</Form.InputLabel>
<Form.ColorInput id="colorSmall" sizing="sm" value="#563d7c" />

<Form.InputLabel for="colorLarge">Large color</Form.InputLabel>
<Form.ColorInput id="colorLarge" sizing="lg" value="#563d7c" />

<Form.InputLabel for="colorBound">Bound color</Form.InputLabel>
<Form.ColorInput id="colorBound" bind:value={colorInputValue} />
<span>Output:</span>&nbsp;<code>{colorInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Date Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.DateInput value="2025-06-10" aria-label="Choose date" title="Choose your date" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.DateInput disabled value="2025-06-10" aria-label="Choose date" title="Choose your date" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.DateInput readonly value="2025-06-10" aria-label="Choose date" title="Choose your date" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.DateInput isPlaintext readonly value="2025-06-10" aria-label="Choose date" title="Choose your date" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.DateInput sizing="sm" value="2025-06-10" aria-label="Choose date" title="Choose your date" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.DateInput sizing="lg" value="2025-06-10" aria-label="Choose date" title="Choose your date" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.DateInput list="listOfDates" aria-label="Choose date" title="Choose your date" />
                    <datalist id="listOfDates">
                        <option value="2025-01-01"></option>
                        <option value="2025-02-01"></option>
                        <option value="2025-03-01"></option>
                        <option value="2025-04-01"></option>
                        <option value="2025-05-01"></option>
                        <option value="2025-06-01"></option>
                        <option value="2025-07-01"></option>
                        <option value="2025-08-01"></option>
                        <option value="2025-09-01"></option>
                        <option value="2025-10-01"></option>
                        <option value="2025-11-01"></option>
                        <option value="2025-12-01"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.DateInput bind:value={dateInputValue} aria-label="Choose date" title="Choose your date" />
                    <span>Output:</span>&nbsp;<code>{dateInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let dateInputValue: string = $state("2025-06-10");
\u003c/script>
<Form.DateInput value="2025-06-10" aria-label="Choose date" title="Choose your date" /><!-- Default -->
<Form.DateInput disabled value="2025-06-10" aria-label="Choose date" title="Choose your date" /><!-- Disabled -->
<Form.DateInput readonly value="2025-06-10" aria-label="Choose date" title="Choose your date" /><!-- Readonly -->
<Form.DateInput isPlaintext readonly value="2025-06-10" aria-label="Choose date" title="Choose your date" /><!-- Readonly plaintext -->
<Form.DateInput sizing="sm" value="2025-06-10" aria-label="Choose date" title="Choose your date" /><!-- Small sizing -->
<Form.DateInput sizing="lg" value="2025-06-10" aria-label="Choose date" title="Choose your date" /><!-- Large sizing -->
<Form.DateInput list="listOfDates" aria-label="Choose date" title="Choose your date" /><!-- Datalist -->
<datalist id="listOfDates">
    <option value="2025-01-01"></option>
    <option value="2025-02-01"></option>
    <option value="2025-03-01"></option>
    <option value="2025-04-01"></option>
    <option value="2025-05-01"></option>
    <option value="2025-06-01"></option>
    <option value="2025-07-01"></option>
    <option value="2025-08-01"></option>
    <option value="2025-09-01"></option>
    <option value="2025-10-01"></option>
    <option value="2025-11-01"></option>
    <option value="2025-12-01"></option>
</datalist>
<Form.DateInput bind:value={dateInputValue} aria-label="Choose date" title="Choose your date" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{dateInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Datetime-local Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.DatetimeLocalInput aria-label="Choose date and time" title="Choose your datetime local" value="2025-06-10T19:30" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.DatetimeLocalInput disabled aria-label="Choose date and time" title="Choose your datetime local" value="2025-06-10T19:30" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.DatetimeLocalInput readonly aria-label="Choose date and time" title="Choose your datetime local" value="2025-06-10T19:30" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.DatetimeLocalInput
                        isPlaintext
                        readonly
                        aria-label="Choose date and time"
                        title="Choose your datetime local"
                        value="2025-06-10T19:30" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.DatetimeLocalInput
                        sizing="sm"
                        aria-label="Choose date and time"
                        title="Choose your datetime local"
                        value="2025-06-10T19:30" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.DatetimeLocalInput
                        sizing="lg"
                        aria-label="Choose date and time"
                        title="Choose your datetime local"
                        value="2025-06-10T19:30" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.DatetimeLocalInput list="listOfDatetimes" aria-label="Choose date and time" title="Choose your datetime local" />
                    <datalist id="listOfDatetimes">
                        <option value="2025-01-01T00:00"></option>
                        <option value="2025-02-01T00:00"></option>
                        <option value="2025-03-01T00:00"></option>
                        <option value="2025-04-01T00:00"></option>
                        <option value="2025-05-01T00:00"></option>
                        <option value="2025-06-01T00:00"></option>
                        <option value="2025-07-01T00:00"></option>
                        <option value="2025-08-01T00:00"></option>
                        <option value="2025-09-01T00:00"></option>
                        <option value="2025-10-01T00:00"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.DatetimeLocalInput
                        aria-label="Choose date and time"
                        title="Choose your datetime local"
                        bind:value={datetimeLocalInputValue} />
                    <span>Output:</span>&nbsp;<code>{datetimeLocalInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let datetimeLocalInputValue: string = $state("2025-06-10T19:30");
\u003c/script>
<Form.DatetimeLocalInput aria-label="Choose date and time" title="Choose your datetime local" value="2025-06-10T19:30" /><!-- Default -->
<Form.DatetimeLocalInput disabled aria-label="Choose date and time" title="Choose your datetime local" value="2025-06-10T19:30" /><!-- Disabled -->
<Form.DatetimeLocalInput readonly aria-label="Choose date and time" title="Choose your datetime local" value="2025-06-10T19:30" /><!-- Readonly -->
<Form.DatetimeLocalInput isPlaintext readonly aria-label="Choose date and time" title="Choose your datetime local" value="2025-06-10T19:30" /><!-- Readonly plaintext -->
<Form.DatetimeLocalInput sizing="sm" aria-label="Choose date and time" title="Choose your datetime local" value="2025-06-10T19:30" /><!-- Small sizing -->
<Form.DatetimeLocalInput sizing="lg" aria-label="Choose date and time" title="Choose your datetime local" value="2025-06-10T19:30" /><!-- Large sizing -->
<Form.DatetimeLocalInput list="listOfDatetimes" aria-label="Choose date and time" title="Choose your datetime local" /><!-- Datalist -->
<datalist id="listOfDatetimes">
    <option value="2025-01-01T00:00"></option>
    <option value="2025-02-01T00:00"></option>
    <option value="2025-03-01T00:00"></option>
    <option value="2025-04-01T00:00"></option>
    <option value="2025-05-01T00:00"></option>
    <option value="2025-06-01T00:00"></option>
    <option value="2025-07-01T00:00"></option>
    <option value="2025-08-01T00:00"></option>
    <option value="2025-09-01T00:00"></option>
    <option value="2025-10-01T00:00"></option>
</datalist>
<Form.DatetimeLocalInput aria-label="Choose date and time" title="Choose your datetime local" bind:value={datetimeLocalInputValue} /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{datetimeLocalInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Email Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.EmailInput placeholder="name@example.com" data-form-type="other" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.EmailInput disabled placeholder="name@example.com" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.EmailInput placeholder="name@example.com" readonly />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.EmailInput isPlaintext readonly placeholder="name@example.com" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.EmailInput sizing="sm" placeholder="name@example.com" data-form-type="other" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.EmailInput sizing="lg" placeholder="name@example.com" data-form-type="other" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.EmailInput list="listOfEmails" pattern=".+@example\.com" placeholder="name@example.com" data-form-type="other" />
                    <datalist id="listOfEmails">
                        <option value="alex@example.com"></option>
                        <option value="casey@example.com"></option>
                        <option value="jordan@example.com"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.EmailInput bind:value={emailInputValue} placeholder="type something" data-form-type="other" />
                    <span>Output:</span>&nbsp;<code>{emailInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let emailInputValue: string = $state('');
\u003c/script>
<Form.EmailInput placeholder="name@example.com" /><!-- Default -->
<Form.EmailInput disabled placeholder="name@example.com" /><!-- Disabled -->
<Form.EmailInput placeholder="name@example.com" readonly /><!-- Readonly -->
<Form.EmailInput isPlaintext readonly placeholder="name@example.com" /><!-- Readonly plaintext -->
<Form.EmailInput sizing="sm" placeholder="name@example.com" /><!-- Small sizing -->
<Form.EmailInput sizing="lg" placeholder="name@example.com" /><!-- Large sizing -->
<Form.EmailInput list="listOfEmails" pattern=".+@example.com" placeholder="name@example.com" /><!-- Datalist -->
<datalist id="listOfEmails">
    <option value="alex@example.com"></option>
    <option value="casey@example.com"></option>
    <option value="jordan@example.com"></option>
</datalist>
<Form.EmailInput bind:value={emailInputValue} placeholder="type something" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{emailInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">File Input</h2>
        <p>⚠️ Readonly and plaintext are not supported.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <div class="wk-control-stack">
                        <div>
                            <Form.InputLabel for="fileDefault">Upload image</Form.InputLabel>
                            <Form.FileInput id="fileDefault" accept=".png, .jpg, image/png, image/jpeg" name="newFile" />
                            <Form.HelperText>Accepts PNG or JPG files.</Form.HelperText>
                        </div>
                        <div>
                            <Form.InputLabel for="fileDisabled">Disabled upload</Form.InputLabel>
                            <Form.FileInput id="fileDisabled" accept=".png, .jpg, image/png, image/jpeg" disabled name="newFileDisabled" />
                        </div>
                        <div>
                            <Form.InputLabel for="fileSmall">Small upload</Form.InputLabel>
                            <Form.FileInput id="fileSmall" accept=".png, .jpg, image/png, image/jpeg" name="newFileSmall" sizing="sm" />
                        </div>
                        <div>
                            <Form.InputLabel for="fileLarge">Large upload</Form.InputLabel>
                            <Form.FileInput id="fileLarge" accept=".png, .jpg, image/png, image/jpeg" name="newFileLarge" sizing="lg" />
                        </div>
                        <div>
                            <Form.InputLabel for="fileBound">Bound upload</Form.InputLabel>
                            <Form.FileInput
                                id="fileBound"
                                accept=".png, .jpg, image/png, image/jpeg"
                                bind:files={fileInputValue}
                                name="newFileBound" />
                            <span>Output:</span>&nbsp;<code>{fileInputValue?.[0]?.name ?? 'No file selected'}</code>
                        </div>
                    </div>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let fileInputValue: FileList | null = $state(null);
\u003c/script>
<Form.InputLabel for="fileDefault">Upload image</Form.InputLabel>
<Form.FileInput id="fileDefault" accept=".png, .jpg, image/png, image/jpeg" name="newFile" />
<Form.HelperText>Accepts PNG or JPG files.</Form.HelperText>

<Form.InputLabel for="fileDisabled">Disabled upload</Form.InputLabel>
<Form.FileInput id="fileDisabled" accept=".png, .jpg, image/png, image/jpeg" disabled name="newFileDisabled" />

<Form.InputLabel for="fileSmall">Small upload</Form.InputLabel>
<Form.FileInput id="fileSmall" accept=".png, .jpg, image/png, image/jpeg" name="newFileSmall" sizing="sm" />

<Form.InputLabel for="fileLarge">Large upload</Form.InputLabel>
<Form.FileInput id="fileLarge" accept=".png, .jpg, image/png, image/jpeg" name="newFileLarge" sizing="lg" />

<Form.InputLabel for="fileBound">Bound upload</Form.InputLabel>
<Form.FileInput id="fileBound" accept=".png, .jpg, image/png, image/jpeg" bind:files={fileInputValue} name="newFileBound" />
<span>Output:</span>&nbsp;<code>{fileInputValue?.[0]?.name ?? 'No file selected'}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Floating labels</h2>
        <p>⚠️ Sizing props are ignored and readonly is not useful.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.Floating>
                        <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput1" data-form-type="other" />
                        <Form.InputLabel for="floatingEmailInput1" isFloating>Email address (default)</Form.InputLabel>
                    </Form.Floating>
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.Floating>
                        <Form.EmailInput disabled placeholder="name@example.com" id="floatingEmailInput2" />
                        <Form.InputLabel for="floatingEmailInput2" isFloating>Email address (disabled)</Form.InputLabel>
                    </Form.Floating>
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.Floating>
                        <Form.EmailInput value="name@example.com" id="floatingEmailInput3" readonly />
                        <Form.InputLabel for="floatingEmailInput3" isFloating>Email address (readonly)</Form.InputLabel>
                    </Form.Floating>
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.Floating>
                        <Form.EmailInput value="name@example.com" id="floatingEmailInput4" isPlaintext readonly />
                        <Form.InputLabel for="floatingEmailInput4" isFloating>Email address (Plaintext)</Form.InputLabel>
                    </Form.Floating>
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.Floating>
                        <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput5" sizing="sm" data-form-type="other" />
                        <Form.InputLabel for="floatingEmailInput5" isFloating>Email address (small)</Form.InputLabel>
                    </Form.Floating>
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.Floating>
                        <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput6" sizing="lg" data-form-type="other" />
                        <Form.InputLabel for="floatingEmailInput6" isFloating>Email address (large)</Form.InputLabel>
                    </Form.Floating>
                    <Form.HelperText>Large sizing</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<Form.Floating><!-- Default -->
    <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput" />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>
<Form.Floating><!-- Disabled -->
    <Form.EmailInput disabled placeholder="name@example.com" id="floatingEmailInput" />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>
<Form.Floating><!-- Readonly -->
    <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput" readonly />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>
<Form.Floating><!-- Readonly plaintext -->
    <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput" isPlaintext readonly />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>
<Form.Floating><!-- Small sizing -->
    <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput" sizing="sm" />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>
<Form.Floating><!-- Large sizing -->
    <Form.EmailInput placeholder="name@example.com" id="floatingEmailInput" sizing="lg" />
    <Form.InputLabel for="floatingEmailInput" isFloating>Email address</Form.InputLabel>
</Form.Floating>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Hidden Input</h2>
        <p>
            ⚠️ Bootstrap 5 does not have a specific "hidden input" type. As a result, this component will simply render the input without any
            Bootstrap CSS classes.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.HiddenInput name="hiddenInput" value="Nothing to see here" />
                    <Form.HiddenInput name="hiddenInput2" bind:value={hiddenInputValue} />
                    <Form.HelperText>Not visible</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let hiddenInputValue: string = $state('Nothing to see here as well');
\u003c/script>
<Form.HiddenInput name="hiddenInput" value="Nothing to see here" />
<Form.HiddenInput name="hiddenInput2" bind:value={hiddenInputValue} />`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Image Input</h2>
        <p>
            ⚠️ Bootstrap 5 does not have a specific "image input" type. As a result, this component will simply render the input without any Bootstrap
            CSS classes.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.ImageInput src="https://www.w3schools.com/tags/img_submit.gif" alt="Submit" width="48" height="48" />
                    <Form.HelperText>Default</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code="<Form.ImageInput src=&quot;https://www.w3schools.com/tags/img_submit.gif&quot; alt=&quot;Submit&quot; width=&quot;48&quot; height=&quot;48&quot; />" />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Month Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.MonthInput aria-label="Choose month" title="Choose a month" value="2025-06" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.MonthInput disabled aria-label="Choose month" title="Choose a month" value="2025-06" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.MonthInput readonly aria-label="Choose month" title="Choose a month" value="2025-06" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.MonthInput isPlaintext readonly aria-label="Choose month" title="Choose a month" value="2025-06" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.MonthInput sizing="sm" aria-label="Choose month" title="Choose a month" value="2025-06" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.MonthInput sizing="lg" aria-label="Choose month" title="Choose a month" value="2025-06" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.MonthInput list="listOfMonths" aria-label="Choose month" title="Choose a month" />
                    <datalist id="listOfMonths">
                        <option value="2025-01"></option>
                        <option value="2025-02"></option>
                        <option value="2025-03"></option>
                        <option value="2025-04"></option>
                        <option value="2025-05"></option>
                        <option value="2025-06"></option>
                        <option value="2025-07"></option>
                        <option value="2025-08"></option>
                        <option value="2025-09"></option>
                        <option value="2025-10"></option>
                        <option value="2025-11"></option>
                        <option value="2025-12"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.MonthInput bind:value={monthInputValue} aria-label="Choose month" title="Choose a month" />
                    <span>Output:</span>&nbsp;<code>{monthInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let monthInputValue: string = $state('2025-06');
\u003c/script>
<Form.MonthInput aria-label="Choose month" title="Choose a month" value="2025-06" /><!-- Default -->
<Form.MonthInput disabled aria-label="Choose month" title="Choose a month" value="2025-06" /><!-- Disabled -->
<Form.MonthInput readonly aria-label="Choose month" title="Choose a month" value="2025-06" /><!-- Readonly -->
<Form.MonthInput isPlaintext readonly aria-label="Choose month" title="Choose a month" value="2025-06" /><!-- Readonly plaintext -->
<Form.MonthInput sizing="sm" aria-label="Choose month" title="Choose a month" value="2025-06" /><!-- Small sizing -->
<Form.MonthInput sizing="lg" aria-label="Choose month" title="Choose a month" value="2025-06" /><!-- Large sizing -->
<Form.MonthInput list="listOfMonths" aria-label="Choose month" title="Choose a month" /><!-- Datalist -->
<datalist id="listOfMonths">
    <option value="2025-01"></option>
    <option value="2025-02"></option>
    <option value="2025-03"></option>
    <option value="2025-04"></option>
    <option value="2025-05"></option>
    <option value="2025-06"></option>
    <option value="2025-07"></option>
    <option value="2025-08"></option>
    <option value="2025-09"></option>
    <option value="2025-10"></option>
    <option value="2025-11"></option>
    <option value="2025-12"></option>
</datalist>
<Form.MonthInput bind:value={monthInputValue} aria-label="Choose month" title="Choose a month" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{monthInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Number Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.NumberInput max="5" min="1" aria-label="Set number" title="Set a number" value="1" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.NumberInput disabled max="5" min="1" aria-label="Set number" title="Set a number" value="1" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.NumberInput max="5" min="1" readonly aria-label="Set number" title="Set a number" value="1" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.NumberInput isPlaintext max="5" min="1" readonly aria-label="Set number" title="Set a number" value="1" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.NumberInput max="5" min="1" sizing="sm" aria-label="Set number" title="Set a number" value="1" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.NumberInput max="5" min="1" sizing="lg" aria-label="Set number" title="Set a number" value="1" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.NumberInput list="listOfNumbers" max="5" min="1" aria-label="Set number" title="Set a number" />
                    <datalist id="listOfNumbers">
                        <option value="1"></option>
                        <option value="2"></option>
                        <option value="3"></option>
                        <option value="4"></option>
                        <option value="5"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.NumberInput bind:value={numberInputValue} max="5" min="1" aria-label="Set number" title="Set a number" />
                    <span>Output:</span>&nbsp;<code>{numberInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let numberInputValue: number = $state(1);
\u003c/script>
<Form.NumberInput max="5" min="1" aria-label="Set number" title="Set a number" value="1" /><!-- Default -->
<Form.NumberInput disabled max="5" min="1" aria-label="Set number" title="Set a number" value="1" /><!-- Disabled -->
<Form.NumberInput max="5" min="1" readonly aria-label="Set number" title="Set a number" value="1" /><!-- Readonly -->
<Form.NumberInput isPlaintext max="5" min="1" readonly aria-label="Set number" title="Set a number" value="1" /><!-- Readonly plaintext -->
<Form.NumberInput max="5" min="1" sizing="sm" aria-label="Set number" title="Set a number" value="1" /><!-- Small sizing -->
<Form.NumberInput max="5" min="1" sizing="lg" aria-label="Set number" title="Set a number" value="1" /><!-- Large sizing -->
<Form.NumberInput list="listOfNumbers" max="5" min="1" aria-label="Set number" title="Set a number" /><!-- Datalist -->
<datalist id="listOfNumbers">
    <option value="1"></option>
    <option value="2"></option>
    <option value="3"></option>
    <option value="4"></option>
    <option value="5"></option>
</datalist>
<Form.NumberInput bind:value={numberInputValue} max="5" min="1" aria-label="Set number" title="Set a number" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{numberInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Password Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.PasswordInput aria-label="Set password" title="Set a password" value="myP@55w0rd" data-form-type="other" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.PasswordInput disabled aria-label="Set password" title="Set a password" value="myP@55w0rd" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.PasswordInput readonly aria-label="Set password" title="Set a password" value="myP@55w0rd" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.PasswordInput isPlaintext readonly aria-label="Set password" title="Set a password" value="myP@55w0rd" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.PasswordInput sizing="sm" aria-label="Set password" title="Set a password" value="myP@55w0rd" data-form-type="other" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.PasswordInput sizing="lg" aria-label="Set password" title="Set a password" value="myP@55w0rd" data-form-type="other" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.PasswordInput bind:value={passwordInputValue} aria-label="Set password" title="Set a password" data-form-type="other" />
                    <span>Output:</span>&nbsp;<code>{passwordInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                    <Form.PasswordInput {showPassword} aria-label="Set password" title="Set a password" value="myP@55w0rd" data-form-type="other" />
                    <Form.Check>
                        <Form.CheckInput id="showPassword" bind:checked={showPassword} />
                        <Form.CheckLabel for="showPassword">Show password</Form.CheckLabel>
                    </Form.Check>
                    <Form.HelperText>Show Password</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let passwordInputValue: string = $state('myP@55w0rd');
    let showPassword: boolean = $state(false);
\u003c/script>
<Form.PasswordInput aria-label="Set password" title="Set a password" value="myP@55w0rd" /><!-- Default -->
<Form.PasswordInput disabled aria-label="Set password" title="Set a password" value="myP@55w0rd" /><!-- Disabled -->
<Form.PasswordInput readonly aria-label="Set password" title="Set a password" value="myP@55w0rd" /><!-- Readonly -->
<Form.PasswordInput isPlaintext readonly aria-label="Set password" title="Set a password" value="myP@55w0rd" /><!-- Readonly plaintext -->
<Form.PasswordInput sizing="sm" aria-label="Set password" title="Set a password" value="myP@55w0rd" /><!-- Small sizing -->
<Form.PasswordInput sizing="lg" aria-label="Set password" title="Set a password" value="myP@55w0rd" /><!-- Large sizing -->
<Form.PasswordInput bind:value={passwordInputValue} aria-label="Set password" title="Set a password" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{passwordInputValue}</code>
<Form.PasswordInput {showPassword} aria-label="Set password" title="Set a password" value="myP@55w0rd" /><!-- Show Password -->
<Form.Check>
    <Form.CheckInput id="showPassword" bind:checked={showPassword} />
    <Form.CheckLabel for="showPassword">Show password</Form.CheckLabel>
</Form.Check>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Radio Input</h2>
        <p>⚠️ Readonly and plaintext are not supported.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.Check>
                        <Form.RadioInput id="radioDefault" value="" />
                        <Form.RadioLabel for="radioDefault">Default radio</Form.RadioLabel>
                    </Form.Check>
                    <Form.Check>
                        <Form.RadioInput checked id="radioChecked" value="" />
                        <Form.RadioLabel for="radioChecked">Checked radio</Form.RadioLabel>
                    </Form.Check>
                    <Form.Check>
                        <Form.RadioInput disabled id="radioDisabled" value="" />
                        <Form.RadioLabel for="radioDisabled">Disabled radio</Form.RadioLabel>
                    </Form.Check>
                    <Form.Check>
                        <Form.RadioInput checked disabled id="radioDisabledChecked" value="" />
                        <Form.RadioLabel for="radioDisabledChecked">Disabled checked radio</Form.RadioLabel>
                    </Form.Check>
                    <hr />
                    <Form.Check isInline>
                        <Form.RadioInput bind:group={radioValue} id="radioBounded" name="radioBounded" value="1" />
                        <Form.RadioLabel for="radioBounded">Radio bounded value 1</Form.RadioLabel>
                    </Form.Check>
                    <Form.Check isInline>
                        <Form.RadioInput bind:group={radioValue} id="radioBounded2" name="radioBounded" value="2" />
                        <Form.RadioLabel for="radioBounded2">Radio bounded value 2</Form.RadioLabel>
                    </Form.Check>
                    <span>Output:</span>&nbsp;<code>{radioValue}</code>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let radioValue: string = $state('');
\u003c/script>
<Form.Check><!-- Default -->
    <Form.RadioInput id="radioDefault" value="" />
    <Form.RadioLabel for="radioDefault">Default radio</Form.RadioLabel>
</Form.Check>
<Form.Check><!-- Checked -->
    <Form.RadioInput checked id="radioChecked" value="" />
    <Form.RadioLabel for="radioChecked">Checked radio</Form.RadioLabel>
</Form.Check>
<Form.Check><!-- Disabled -->
    <Form.RadioInput disabled id="radioDisabled" value="" />
    <Form.RadioLabel for="radioDisabled">Disabled radio</Form.RadioLabel>
</Form.Check>
<Form.Check><!-- Disabled checked -->
    <Form.RadioInput checked disabled id="radioDisabledChecked" value="" />
    <Form.RadioLabel for="radioDisabledChecked">Disabled checked radio</Form.RadioLabel>
</Form.Check>
<hr />
<Form.Check isInline><!-- Bounded value -->
    <Form.RadioInput bind:group={radioValue} id="radioBounded" name="radioBounded" value="1" />
    <Form.RadioLabel for="radioBounded">Radio bounded value 1</Form.RadioLabel>
</Form.Check>
<Form.Check isInline>
    <Form.RadioInput bind:group={radioValue} id="radioBounded2" name="radioBounded" value="2" />
    <Form.RadioLabel for="radioBounded2">Radio bounded value 2</Form.RadioLabel>
</Form.Check>
<span>Output:</span>&nbsp;<code>{radioValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Range Input</h2>
        <p>⚠️ Readonly, plaintext, and sizing are not supported.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.RangeInput max="5" min="0" step="0.5" aria-label="Set number" title="Set a number" value="1" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.RangeInput disabled max="5" min="0" step="0.5" aria-label="Set number" title="Set a number" value="1" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.RangeInput bind:value={rangeInputValue} max="5" min="0" step="0.5" aria-label="Set number" title="Set a number" />
                    <span>Output:</span>&nbsp;<code>{rangeInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let rangeInputValue: number = $state(1);
\u003c/script>
<Form.RangeInput max="5" min="0" step="0.5" aria-label="Set number" title="Set a number" value="1" /><!-- Default -->
<Form.RangeInput disabled max="5" min="0" step="0.5" aria-label="Set number" title="Set a number" value="1" /><!-- Disabled -->
<Form.RangeInput bind:value={rangeInputValue} max="5" min="0" step="0.5" aria-label="Set number" title="Set a number" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{rangeInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Search Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.SearchInput aria-label="Set search value" title="Set a search value" value="search value" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.SearchInput disabled aria-label="Set search value" title="Set a search value" value="search value" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.SearchInput readonly aria-label="Set search value" title="Set a search value" value="search value" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.SearchInput isPlaintext readonly aria-label="Set search value" title="Set a search value" value="search value" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.SearchInput sizing="sm" aria-label="Set search value" title="Set a search value" value="search value" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.SearchInput sizing="lg" aria-label="Set search value" title="Set a search value" value="search value" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.SearchInput list="listOfSearchValues" aria-label="Set search value" title="Set a search value" value="search value" />
                    <datalist id="listOfSearchValues">
                        <option value="search value 1"></option>
                        <option value="search value 2"></option>
                        <option value="search value 3"></option>
                        <option value="search value 4"></option>
                        <option value="search value 5"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.SearchInput bind:value={searchInputValue} aria-label="Set search value" title="Set a search value" />
                    <span>Output:</span>&nbsp;<code>{searchInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let searchInputValue: string = $state('search value');
\u003c/script>
<Form.SearchInput aria-label="Set search value" title="Set a search value" value="search value" /><!-- Default -->
<Form.SearchInput disabled aria-label="Set search value" title="Set a search value" value="search value" /><!-- Disabled -->
<Form.SearchInput readonly aria-label="Set search value" title="Set a search value" value="search value" /><!-- Readonly -->
<Form.SearchInput isPlaintext readonly aria-label="Set search value" title="Set a search value" value="search value" /><!-- Readonly plaintext -->
<Form.SearchInput sizing="sm" aria-label="Set search value" title="Set a search value" value="search value" /><!-- Small sizing -->
<Form.SearchInput sizing="lg" aria-label="Set search value" title="Set a search value" value="search value" /><!-- Large sizing -->
<Form.SearchInput list="listOfSearchValues" aria-label="Set search value" title="Set a search value" value="search value" /><!-- Datalist -->
<datalist id="listOfSearchValues">
    <option value="search value 1"></option>
    <option value="search value 2"></option>
    <option value="search value 3"></option>
    <option value="search value 4"></option>
    <option value="search value 5"></option>
</datalist>
<Form.SearchInput bind:value={searchInputValue} aria-label="Set search value" title="Set a search value" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{searchInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Select</h2>
        <p>⚠️ Readonly and plaintext are not supported.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.Select aria-label="Default select example">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.Select aria-label="Disabled select example" disabled>
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.Select aria-label="Multiple select example" multiple>
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.HelperText>Multiple</Form.HelperText>
                    <Form.Select aria-label="Size of 2 select example" multiple size={2}>
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.HelperText>Size</Form.HelperText>
                    <Form.Select aria-label="Default select example" sizing="sm">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.Select aria-label="Default select example" sizing="lg">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.Select aria-label="Default select example" bind:value={selectValue}>
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <span>Output:</span>&nbsp;<code>{selectValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<Form.Select aria-label="Default select example"><!-- Default -->
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>
<Form.HelperText>Default</Form.HelperText>
<Form.Select aria-label="Disabled select example" disabled><!-- Disabled -->
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>
<Form.HelperText>Disabled</Form.HelperText>
<Form.Select aria-label="Multiple select example" multiple><!-- Multiple -->
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>
<Form.HelperText>Multiple</Form.HelperText>
<Form.Select aria-label="Size of 2 select example" multiple size={2}><!-- Size -->
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>
<Form.HelperText>Size</Form.HelperText>
<Form.Select aria-label="Default select example" sizing="sm"><!-- Small sizing -->
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>
<Form.HelperText>Small sizing</Form.HelperText>
<Form.Select aria-label="Default select example" sizing="lg"><!-- Large sizing -->
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>
<Form.Select aria-label="Default select example" bind:value={selectValue}><!-- Bounded value -->
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</Form.Select>
<span>Output:</span>&nbsp;<code>{selectValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Switch Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.Check isSwitch>
                        <Form.SwitchInput id="switchDefault" name="switchDefault" value="" />
                        <Form.SwitchLabel for="switchDefault">Default checkbox</Form.SwitchLabel>
                    </Form.Check>
                    <Form.Check isSwitch>
                        <Form.SwitchInput checked id="switchChecked" name="switchChecked" value="" />
                        <Form.SwitchLabel for="switchChecked">Checked switch checkbox</Form.SwitchLabel>
                    </Form.Check>
                    <Form.Check isSwitch>
                        <Form.SwitchInput disabled id="switchDisabled" name="switchDisabled" value="" />
                        <Form.SwitchLabel for="switchDisabled">Disabled switch checkbox</Form.SwitchLabel>
                    </Form.Check>
                    <Form.Check isSwitch>
                        <Form.SwitchInput checked disabled id="switchDisabledChecked" name="switchDisabledChecked" value="" />
                        <Form.SwitchLabel for="switchDisabledChecked">Disabled checked switch checkbox</Form.SwitchLabel>
                    </Form.Check>
                    <Form.Check isSwitch>
                        <Form.SwitchInput bind:checked={switchInputValue} id="switchBounded" name="switchBounded" />
                        <Form.SwitchLabel for="switchBounded">Bounded switch checked value</Form.SwitchLabel>
                    </Form.Check>
                    <span>Output:</span>&nbsp;<code>{switchInputValue}</code>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let switchInputValue: boolean = $state(false);
\u003c/script>
<Form.Check isSwitch><!-- Default switch checkbox -->
    <Form.SwitchInput id="switchDefault" name="switchDefault" value="" />
    <Form.SwitchLabel for="switchDefault">Default switch checkbox</Form.SwitchLabel>
</Form.Check>
<Form.Check isSwitch><!-- Checked switch checkbox -->
    <Form.SwitchInput checked id="switchChecked" name="switchChecked" value="" />
    <Form.SwitchLabel for="switchChecked">Checked switch checkbox</Form.SwitchLabel>
</Form.Check>
<Form.Check isSwitch><!-- Disabled switch checkbox -->
    <Form.SwitchInput disabled id="switchDisabled" name="switchDisabled" value="" />
    <Form.SwitchLabel for="switchDisabled">Disabled switch checkbox</Form.SwitchLabel>
</Form.Check>
<Form.Check isSwitch><!-- Disabled checked switch checkbox -->
    <Form.SwitchInput checked disabled id="switchDisabledChecked" name="switchDisabledChecked" value="" />
    <Form.SwitchLabel for="switchDisabledChecked">Disabled checked switch checkbox</Form.SwitchLabel>
</Form.Check>
<Form.Check isSwitch><!-- Bounded switch checked value -->
    <Form.SwitchInput bind:checked={switchInputValue} id="switchBounded" name="switchBounded" />
    <Form.SwitchLabel for="switchBounded">Bounded switch checked value</Form.SwitchLabel>
</Form.Check>
<span>Output:</span>&nbsp;<code>{switchInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Telephone Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.TelephoneInput placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.TelephoneInput disabled placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.TelephoneInput readonly placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.TelephoneInput isPlaintext readonly placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.TelephoneInput sizing="sm" placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.TelephoneInput sizing="lg" placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.TelephoneInput list="listOfTelephones" placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" />
                    <datalist id="listOfTelephones">
                        <option value="555-123-4567"></option>
                        <option value="555-234-5678"></option>
                        <option value="555-345-6789"></option>
                        <option value="555-456-7890"></option>
                        <option value="555-567-8901"></option>
                        <option value="555-678-9012"></option>
                        <option value="555-789-0123"></option>
                        <option value="555-890-1234"></option>
                        <option value="555-901-2345"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.TelephoneInput bind:value={telephoneInputValue} placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" />
                    <span>Output:</span>&nbsp;<code>{telephoneInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let telephoneInputValue: string = $state('555-867-5309');
\u003c/script>
<Form.TelephoneInput placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" /><!-- Default -->
<Form.TelephoneInput disabled placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" /><!-- Disabled -->
<Form.TelephoneInput readonly placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" /><!-- Readonly -->
<Form.TelephoneInput isPlaintext readonly placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" /><!-- Readonly plaintext -->
<Form.TelephoneInput sizing="sm" placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" /><!-- Small sizing -->
<Form.TelephoneInput sizing="lg" placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" /><!-- Large sizing -->
<Form.TelephoneInput list="listOfTelephones" placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" /><!-- Datalist -->
<datalist id="listOfTelephones">
    <option value="555-123-4567"></option>
    <option value="555-234-5678"></option>
    <option value="555-345-6789"></option>
    <option value="555-456-7890"></option>
    <option value="555-567-8901"></option>
    <option value="555-678-9012"></option>
    <option value="555-789-0123"></option>
    <option value="555-890-1234"></option>
    <option value="555-901-2345"></option>
</datalist>
<Form.TelephoneInput bind:value={telephoneInputValue} placeholder="555-867-5309" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{telephoneInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Telephone Input — with <code>mask</code></h2>
        <p>
            Use the optional <code>mask</code> prop to format input as the user types. <code>#</code> marks a digit slot; any other character (<code
                >(</code
            >, <code>)</code>, <code>-</code>, <code>.</code>, space, <code>+</code>, …) is treated as a literal and inserted automatically.
            <code>mask</code> is independent of <code>pattern</code> — <code>pattern</code> continues to drive native browser validation only.
        </p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.TelephoneInput
                        bind:value={telephoneInputMaskedValue}
                        mask="(###) ###-####"
                        pattern="\(\d{3}\) \d{3}-\d{4}"
                        placeholder="(555) 515-1212"
                        required />
                    <span>Output:</span>&nbsp;<code>{telephoneInputMaskedValue}</code>
                    <Form.HelperText>Single mask — <code>(###) ###-####</code></Form.HelperText>
                    <Form.TelephoneInput
                        bind:value={telephoneInputMaskedArrayValue}
                        mask={['###-###-####', '+# (###) ###-####']}
                        placeholder="555-515-1212" />
                    <span>Output:</span>&nbsp;<code>{telephoneInputMaskedArrayValue}</code>
                    <Form.HelperText>
                        Array of masks — the first mask that fits the typed digit count is used. Try typing 10 digits, then add an 11th to see the
                        second mask take over.
                    </Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let telephoneInputMaskedValue: string = $state('');
    let telephoneInputMaskedArrayValue: string = $state('');
\u003c/script>
<Form.TelephoneInput
    bind:value={telephoneInputMaskedValue}
    mask="(###) ###-####"
    pattern="\\(\\d{3}\\) \\d{3}-\\d{4}"
    placeholder="(555) 515-1212"
    required /><!-- Single mask -->
<span>Output:</span>&nbsp;<code>{telephoneInputMaskedValue}</code>

<Form.TelephoneInput
    bind:value={telephoneInputMaskedArrayValue}
    mask={['###-###-####', '+# (###) ###-####']}
    placeholder="555-515-1212" /><!-- Array of masks -->
<span>Output:</span>&nbsp;<code>{telephoneInputMaskedArrayValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Text Area</h2>
        <p>⚠️ Plaintext is not supported.</p>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.TextArea aria-label="Set text value" title="Set a text value" value="textarea value" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.TextArea disabled aria-label="Set textarea value" title="Set a textarea value" value="textarea value" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.TextArea readonly aria-label="Set textarea value" title="Set a textarea value" value="textarea value" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.TextArea sizing="sm" aria-label="Set textarea value" title="Set a textarea value" value="textarea value" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.TextArea sizing="lg" aria-label="Set textarea value" title="Set a textarea value" value="textarea value" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.TextArea isResizable={false} aria-label="Set text value" title="Set a text value" value="textarea value" />
                    <Form.HelperText>Not resizable</Form.HelperText>
                    <Form.TextArea bind:value={textAreaValue} aria-label="Set textarea value" title="Set a textarea value" />
                    <span>Output:</span>&nbsp;<code>{textAreaValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let textAreaValue: string = $state('textarea value');
\u003c/script>
<Form.TextArea aria-label="Set text value" title="Set a text value" value="textarea value" /><!-- Default -->
<Form.TextArea disabled aria-label="Set textarea value" title="Set a textarea value" value="textarea value" /><!-- Disabled -->
<Form.TextArea readonly aria-label="Set textarea value" title="Set a textarea value" value="textarea value" /><!-- Readonly -->
<Form.TextArea sizing="sm" aria-label="Set textarea value" title="Set a textarea value" value="textarea value" /><!-- Small sizing -->
<Form.TextArea sizing="lg" aria-label="Set textarea value" title="Set a textarea value" value="textarea value" /><!-- Large sizing -->
<Form.TextArea isResizable={false} aria-label="Set textarea value" title="Set a textarea value" value="textarea value" /><!-- Not resizable -->
<Form.TextArea bind:value={textAreaValue} aria-label="Set textarea value" title="Set a textarea value" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{textAreaValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Text Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.TextInput aria-label="Set text value" title="Set a text value" value="text value" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.TextInput disabled aria-label="Set text value" title="Set a text value" value="text value" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.TextInput readonly aria-label="Set text value" title="Set a text value" value="text value" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.TextInput isPlaintext readonly aria-label="Set text value" title="Set a text value" value="text value" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.TextInput sizing="sm" aria-label="Set text value" title="Set a text value" value="text value" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.TextInput sizing="lg" aria-label="Set text value" title="Set a text value" value="text value" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.TextInput list="listOfTextValues" aria-label="Set text value" title="Set a text value" value="text value" />
                    <datalist id="listOfTextValues">
                        <option value="text value 1"></option>
                        <option value="text value 2"></option>
                        <option value="text value 3"></option>
                        <option value="text value 4"></option>
                        <option value="text value 5"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.TextInput bind:value={textInputValue} aria-label="Set text value" title="Set a text value" />
                    <span>Output:</span>&nbsp;<code>{textInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let textInputValue: string = $state('text value');
\u003c/script>
<Form.TextInput aria-label="Set text value" title="Set a text value" value="text value" /><!-- Default -->
<Form.TextInput disabled aria-label="Set text value" title="Set a text value" value="text value" /><!-- Disabled -->
<Form.TextInput readonly aria-label="Set text value" title="Set a text value" value="text value" /><!-- Readonly -->
<Form.TextInput isPlaintext readonly aria-label="Set text value" title="Set a text value" value="text value" /><!-- Readonly plaintext -->
<Form.TextInput sizing="sm" aria-label="Set text value" title="Set a text value" value="text value" /><!-- Small sizing -->
<Form.TextInput sizing="lg" aria-label="Set text value" title="Set a text value" value="text value" /><!-- Large sizing -->
<Form.TextInput list="listOfTextValues" aria-label="Set text value" title="Set a text value" value="text value" /><!-- Datalist -->
<datalist id="listOfTextValues">
    <option value="text value 1"></option>
    <option value="text value 2"></option>
    <option value="text value 3"></option>
    <option value="text value 4"></option>
    <option value="text value 5"></option>
</datalist>
<Form.TextInput bind:value={textInputValue} aria-label="Set text value" title="Set a text value" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{textInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Time Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.TimeInput max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.TimeInput disabled max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.TimeInput readonly max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.TimeInput isPlaintext readonly max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.TimeInput sizing="sm" max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.TimeInput sizing="lg" max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.TimeInput list="listOfTimes" max="12:00" min="00:00" aria-label="Set time" title="Set a time" />
                    <datalist id="listOfTimes">
                        <option value="00:00"></option>
                        <option value="01:00"></option>
                        <option value="02:00"></option>
                        <option value="03:00"></option>
                        <option value="04:00"></option>
                        <option value="05:00"></option>
                        <option value="06:00"></option>
                        <option value="07:00"></option>
                        <option value="08:00"></option>
                        <option value="09:00"></option>
                        <option value="10:00"></option>
                        <option value="11:00"></option>
                        <option value="12:00"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.TimeInput bind:value={timeInputValue} max="12:00" min="00:00" aria-label="Set time" title="Set a time" />
                    <span>Output:</span>&nbsp;<code>{timeInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let timeInputValue: string = $state('07:32');
\u003c/script>
<Form.TimeInput max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" /><!-- Default -->
<Form.TimeInput disabled max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" /><!-- Disabled -->
<Form.TimeInput readonly max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" /><!-- Readonly -->
<Form.TimeInput isPlaintext readonly max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" /><!-- Readonly plaintext -->
<Form.TimeInput sizing="sm" max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" /><!-- Small sizing -->
<Form.TimeInput sizing="lg" max="12:00" min="00:00" aria-label="Set time" title="Set a time" value="07:32" /><!-- Large sizing -->
<Form.TimeInput list="listOfTimes" max="12:00" min="00:00" aria-label="Set time" title="Set a time" /><!-- Datalist -->
<datalist id="listOfTimes">
    <option value="00:00"></option>
    <option value="01:00"></option>
    <option value="02:00"></option>
    <option value="03:00"></option>
    <option value="04:00"></option>
    <option value="05:00"></option>
    <option value="06:00"></option>
    <option value="07:00"></option>
    <option value="08:00"></option>
    <option value="09:00"></option>
    <option value="10:00"></option>
    <option value="11:00"></option>
    <option value="12:00"></option>
</datalist>
<Form.TimeInput bind:value={timeInputValue} max="12:00" min="00:00" aria-label="Set time" title="Set a time" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{timeInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">URL Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.UrlInput pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.UrlInput disabled pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.UrlInput readonly pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.UrlInput
                        isPlaintext
                        readonly
                        pattern="https://.*"
                        placeholder="https://example.com"
                        aria-label="Set URL"
                        title="Set a URL" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.UrlInput sizing="sm" pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.UrlInput sizing="lg" pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.UrlInput list="listOfUrls" pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" />
                    <datalist id="listOfUrls">
                        <option value="https://developer.mozilla.org/"></option>
                        <option value="http://www.google.com/"></option>
                        <option value="http://www.microsoft.com/"></option>
                        <option value="https://www.mozilla.org/"></option>
                        <option value="http://w3.org/"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.UrlInput
                        bind:value={urlInputValue}
                        pattern="https://.*"
                        placeholder="https://example.com"
                        aria-label="Set URL"
                        title="Set a URL" />
                    <span>Output:</span>&nbsp;<code>{urlInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let urlInputValue: string = $state('https://example.com');
\u003c/script>
<Form.UrlInput pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" /><!-- Default -->
<Form.UrlInput disabled pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" /><!-- Disabled -->
<Form.UrlInput readonly pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" /><!-- Readonly -->
<Form.UrlInput isPlaintext readonly pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" /><!-- Readonly plaintext -->
<Form.UrlInput sizing="sm" pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" /><!-- Small sizing -->
<Form.UrlInput sizing="lg" pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" /><!-- Large sizing -->
<Form.UrlInput list="listOfUrls" pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" /><!-- Datalist -->
<datalist id="listOfUrls">
    <option value="https://developer.mozilla.org/"></option>
    <option value="http://www.google.com/"></option>
    <option value="http://www.microsoft.com/"></option>
    <option value="https://www.mozilla.org/"></option>
    <option value="http://w3.org/"></option>
</datalist>
<Form.UrlInput bind:value={urlInputValue} pattern="https://.*" placeholder="https://example.com" aria-label="Set URL" title="Set a URL" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{urlInputValue}</code>`} />
            </div>
        </div>
        <h2 class="wk-quick-link mb-3">Week Input</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <Form.WeekInput aria-label="Set week" title="Set a week" value="2025-W07" />
                    <Form.HelperText>Default</Form.HelperText>
                    <Form.WeekInput disabled aria-label="Set week" title="Set a week" value="2025-W07" />
                    <Form.HelperText>Disabled</Form.HelperText>
                    <Form.WeekInput readonly aria-label="Set week" title="Set a week" value="2025-W07" />
                    <Form.HelperText>Readonly</Form.HelperText>
                    <Form.WeekInput isPlaintext readonly aria-label="Set week" title="Set a week" value="2025-W07" />
                    <Form.HelperText>Readonly plaintext</Form.HelperText>
                    <Form.WeekInput sizing="sm" aria-label="Set week" title="Set a week" value="2025-W07" />
                    <Form.HelperText>Small sizing</Form.HelperText>
                    <Form.WeekInput sizing="lg" aria-label="Set week" title="Set a week" value="2025-W07" />
                    <Form.HelperText>Large sizing</Form.HelperText>
                    <Form.WeekInput list="listOfWeeks" aria-label="Set week" title="Set a week" />
                    <datalist id="listOfWeeks">
                        <option value="2025-W01"></option>
                        <option value="2025-W02"></option>
                        <option value="2025-W03"></option>
                        <option value="2025-W04"></option>
                        <option value="2025-W05"></option>
                        <option value="2025-W06"></option>
                        <option value="2025-W07"></option>
                        <option value="2025-W08"></option>
                        <option value="2025-W09"></option>
                        <option value="2025-W10"></option>
                    </datalist>
                    <Form.HelperText>Datalist</Form.HelperText>
                    <Form.WeekInput bind:value={weekInputValue} aria-label="Set week" title="Set a week" />
                    <span>Output:</span>&nbsp;<code>{weekInputValue}</code>
                    <Form.HelperText>Bounded value</Form.HelperText>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let weekInputValue: string = $state('2025-W07');
\u003c/script>
<Form.WeekInput aria-label="Set week" title="Set a week" value="2025-W07" /><!-- Default -->
<Form.WeekInput disabled aria-label="Set week" title="Set a week" value="2025-W07" /><!-- Disabled -->
<Form.WeekInput readonly aria-label="Set week" title="Set a week" value="2025-W07" /><!-- Readonly -->
<Form.WeekInput isPlaintext readonly aria-label="Set week" title="Set a week" value="2025-W07" /><!-- Readonly plaintext -->
<Form.WeekInput sizing="sm" aria-label="Set week" title="Set a week" value="2025-W07" /><!-- Small sizing -->
<Form.WeekInput sizing="lg" aria-label="Set week" title="Set a week" value="2025-W07" /><!-- Large sizing -->
<Form.WeekInput list="listOfTextValues" aria-label="Set week" title="Set a week" /><!-- Datalist -->
<datalist id="listOfWeeks">
    <option value="2025-W01"></option>
    <option value="2025-W02"></option>
    <option value="2025-W03"></option>
    <option value="2025-W04"></option>
    <option value="2025-W05"></option>
    <option value="2025-W06"></option>
    <option value="2025-W07"></option>
    <option value="2025-W08"></option>
    <option value="2025-W09"></option>
    <option value="2025-W10"></option>
</datalist>
<Form.WeekInput bind:value={weekInputValue} aria-label="Set week" title="Set a week" /><!-- Bounded value -->
<span>Output:</span>&nbsp;<code>{weekInputValue}</code>`} />
            </div>
        </div>
    </section>
</div>

<style global>
    .wk-control-stack {
        display: grid;
        gap: 1rem;
        max-width: 32rem;
    }

    #control-examples input:not([type='checkbox']):not([type='radio']),
    #control-examples select,
    #control-examples textarea {
        margin-top: 1rem;
    }
</style>
