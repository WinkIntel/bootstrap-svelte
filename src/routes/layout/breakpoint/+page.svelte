<script lang="ts">
    import { BreakpointEnum, BreakpointListener } from '$lib/index.js';
    import SyntaxHighlighter from '../../(common)/SyntaxHighlighter.svelte';

    let currentBreakpoint = $state<BreakpointEnum | undefined>(undefined);
    let onChangeCurrentBreakpoint = $state<BreakpointEnum | undefined>(undefined);
    let onChangePreviousBreakpoint = $state<BreakpointEnum | null>(null);
    let onBreakUpFromBreakpoint = $state<BreakpointEnum | null>(null);
    let onBreakUpToBreakpoint = $state<BreakpointEnum | null>(null);
    let onBreakDownFromBreakpoint = $state<BreakpointEnum | null>(null);
    let onBreakDownToBreakpoint = $state<BreakpointEnum | null>(null);
</script>

<div class="wk-breakpoint-content">
    <div class="mb-4">
        <h1>Breakpoint</h1>
        <p class="lead">
            Breakpoints are customizable widths that determine how your responsive layout behaves across device or viewport sizes in Bootstrap.
        </p>
        <p>
            The following examples replicate each of the examples from the Bootstrap documentation: <a
                href="https://getbootstrap.com/docs/5.3/layout/breakpoints/"
                target="_blank">https://getbootstrap.com/docs/5.3/layout/breakpoints/</a>
        </p>
        <hr />
    </div>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Bindable Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <BreakpointListener bind:currentBreakpoint />
                    <p>The current breakpoint is: <strong>{currentBreakpoint != null ? BreakpointEnum[currentBreakpoint] : 'undefined'}</strong></p>
                </div>
                <SyntaxHighlighter
                    code={`<script lang="ts">
    let currentBreakpoint = $state<BreakpointEnum | undefined>(undefined);;
\u003c/script>
<BreakpointListener bind:currentBreakpoint />
<p>The current breakpoint is: <strong>{currentBreakpoint != null ? BreakpointEnum[currentBreakpoint] : 'undefined'}</strong></p>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Render On Single Breakpoint Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <p>The following content will only render on medium screens:</p>
                    <BreakpointListener renderOn={BreakpointEnum.MD}>
                        <p>👋🏼😁 Hello Medium Screens</p>
                    </BreakpointListener>
                </div>
                <SyntaxHighlighter
                    code={`<BreakpointListener renderOn={BreakpointEnum.MD}>
    <p>👋🏼😁 Hello Medium Screens</p>
</BreakpointMonitor>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">Render On Multiple Breakpoint Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <p>The following content will only render on medium and large screens:</p>
                    <BreakpointListener renderOn={[BreakpointEnum.MD, BreakpointEnum.LG]}>
                        <p>👋🏼😁 Hello Medium and Large Screens</p>
                    </BreakpointListener>
                </div>
                <SyntaxHighlighter
                    code={`<BreakpointListener renderOn={[BreakpointEnum.MD, BreakpointEnum.LG]}>
    <p>👋🏼😁 Hello Medium and Large Screens</p>
</BreakpointMonitor>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">OnChange Callback Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <BreakpointListener
                        onChange={(changeEvent) => {
                            onChangeCurrentBreakpoint = changeEvent.current;
                            onChangePreviousBreakpoint = changeEvent.previous;
                        }} />
                    <p>
                        The current breakpoint is: <strong
                            >{onChangeCurrentBreakpoint != null ? BreakpointEnum[onChangeCurrentBreakpoint] : 'undefined'}</strong>
                    </p>
                    <p>
                        The previous breakpoint is: <strong
                            >{onChangePreviousBreakpoint != null ? BreakpointEnum[onChangePreviousBreakpoint] : 'undefined'}</strong>
                    </p>
                </div>
                <SyntaxHighlighter
                    code={`<BreakpointListener
    onChange={(changeEvent) => {
        onChangeCurrentBreakpoint = changeEvent.current;
        onChangePreviousBreakpoint = changeEvent.previous;
    }} />
<p>
    The current breakpoint is: <strong>{onChangeCurrentBreakpoint != null ? BreakpointEnum[onChangeCurrentBreakpoint] : 'undefined'}</strong>
</p>
<p>
    The previous breakpoint is: <strong>{onChangePreviousBreakpoint != null ? BreakpointEnum[onChangePreviousBreakpoint] : 'undefined'}</strong>
</p>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">OnBreakUp Callback Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <BreakpointListener
                        onBreakUp={(breakEvent) => {
                            onBreakUpFromBreakpoint = breakEvent.from;
                            onBreakUpToBreakpoint = breakEvent.to;
                        }} />
                    <p>
                        The breakpoint broke up from <strong
                            >{onBreakUpFromBreakpoint != null ? BreakpointEnum[onBreakUpFromBreakpoint] : 'undefined'}</strong>
                    </p>
                    <p>
                        The breakpoint broke up to: <strong
                            >{onBreakUpToBreakpoint != null ? BreakpointEnum[onBreakUpToBreakpoint] : 'undefined'}</strong>
                    </p>
                </div>
                <SyntaxHighlighter
                    code={`<BreakpointListener
    onBreakUp={(breakEvent) => {
        onBreakUpFromBreakpoint = breakEvent.from;
        onBreakUpToBreakpoint = breakEvent.to;
    }} />
<p>
    The breakpoint broke up from <strong>{onBreakUpFromBreakpoint != null ? BreakpointEnum[onBreakUpFromBreakpoint] : 'undefined'}</strong>
</p>
<p>
    The breakpoint broke up to: <strong>{onBreakUpToBreakpoint != null ? BreakpointEnum[onBreakUpToBreakpoint] : 'undefined'}</strong>
</p>`} />
            </div>
        </div>
    </section>

    <section class="mb-4">
        <h2 class="wk-quick-link mb-3">OnBreakDown Callback Example</h2>
        <div class="card mb-3">
            <div class="card-body">
                <div class="mb-3">
                    <BreakpointListener
                        onBreakDown={(breakEvent) => {
                            onBreakDownFromBreakpoint = breakEvent.from;
                            onBreakDownToBreakpoint = breakEvent.to;
                        }} />
                    <p>
                        The breakpoint broke down from <strong
                            >{onBreakDownFromBreakpoint != null ? BreakpointEnum[onBreakDownFromBreakpoint] : 'undefined'}</strong>
                    </p>
                    <p>
                        The breakpoint broke down to: <strong
                            >{onBreakDownToBreakpoint != null ? BreakpointEnum[onBreakDownToBreakpoint] : 'undefined'}</strong>
                    </p>
                </div>
                <SyntaxHighlighter
                    code={`<BreakpointListener
    onBreakDown={(breakEvent) => {
        onBreakDownFromBreakpoint = breakEvent.from;
        onBreakDownToBreakpoint = breakEvent.to;
    }} />
<p>
    The breakpoint broke down from <strong>{onBreakDownFromBreakpoint != null ? BreakpointEnum[onBreakDownFromBreakpoint] : 'undefined'}</strong>
</p>
<p>
    The breakpoint broke down to: <strong>{onBreakDownToBreakpoint != null ? BreakpointEnum[onBreakDownToBreakpoint] : 'undefined'}</strong>
</p>`} />
            </div>
        </div>
    </section>

    <!-- API Reference -->
    <section class="mb-4">
        <h2 class="wk-quick-link">API Reference</h2>

        <h3 class="h5 mt-4">Props</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>currentBreakpoint</code></td>
                        <td><code>BreakpointEnum | undefined</code></td>
                        <td><code>undefined</code></td>
                        <td>Reference to the current breakpoint</td>
                    </tr>
                    <tr>
                        <td><code>isDisabled</code></td>
                        <td><code>boolean</code></td>
                        <td><code>false</code></td>
                        <td>Disables the breakpoint monitor if set to true.</td>
                    </tr>
                    <tr>
                        <td><code>renderOn</code></td>
                        <td><code>BreakpointEnum | BreakpointEnum[] | undefined</code></td>
                        <td><code>undefined</code></td>
                        <td>Controls whether the children are rendered based on the current breakpoint.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="h5 mt-4">Events</h3>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>onChange</code></td>
                        <td><code>(changeEvent: ChangeEvent) => void</code></td>
                        <td>Fired when the breakpoint changes.</td>
                    </tr>
                    <tr>
                        <td><code>onBreakUp</code></td>
                        <td><code>(breakEvent: BreakEvent) => void;</code></td>
                        <td>Fired when the breakpoint is about to change to a larger size (at the start of the transition).</td>
                    </tr>
                    <tr>
                        <td><code>onBreakDown</code></td>
                        <td><code>(breakEvent: BreakEvent) => void;</code></td>
                        <td>Fired when the breakpoint is about to change to a smaller size (at the start of the transition).</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</div>

<style global>
    .wk-breakpoint-content [class^='col'],
    .wk-breakpoint-content [class^='col'] > * {
        --bd-violet-rgb: 113, 44, 249;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        background-color: rgba(var(--bd-violet-rgb), 0.15);
        border: 1px solid rgba(var(--bd-violet-rgb), 0.3);
    }
    .wk-breakpoint-content [class^='row'] {
        margin-bottom: 0.75rem;
    }
</style>
