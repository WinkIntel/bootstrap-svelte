<script lang="ts">
    import hljs from 'highlight.js/lib/core';
    import css from 'highlight.js/lib/languages/css';
    import javascript from 'highlight.js/lib/languages/javascript';
    import xml from 'highlight.js/lib/languages/xml';
    import stackoverflowLight from 'svelte-highlight/styles/stackoverflow-light';

    const uid: string = $props.id();

    let { code, label = 'Code example' }: { code: string; label?: string } = $props();

    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('css', css);

    let highlighted = $derived.by(() => hljs.highlightAuto(code).value);
    let regionLabel = $derived(label === 'Code example' ? `Code example ${uid}` : label);
    let copyStatus: 'idle' | 'copied' | 'failed' = $state('idle');
    let copyStatusTimeout: ReturnType<typeof setTimeout> | undefined;

    async function copyCode(): Promise<void> {
        if (copyStatusTimeout) clearTimeout(copyStatusTimeout);

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(code);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = code;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.top = '-1000px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
            }

            copyStatus = 'copied';
        } catch {
            copyStatus = 'failed';
        }

        copyStatusTimeout = setTimeout(() => {
            copyStatus = 'idle';
        }, 2400);
    }
</script>

<svelte:head>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- stackoverflowLight is a static stylesheet bundled at compile time, not user input -->
    {@html stackoverflowLight}
</svelte:head>

<div class="wk-code-example border rounded">
    <div class="wk-code-toolbar">
        <span class="visually-hidden" aria-live="polite">
            {#if copyStatus === 'copied'}
                Code copied to clipboard.
            {:else if copyStatus === 'failed'}
                Code could not be copied.
            {/if}
        </span>
        <button class="btn btn-sm btn-outline-secondary" type="button" onclick={copyCode} aria-label={`Copy ${label.toLowerCase()}`}>
            {copyStatus === 'copied' ? 'Copied' : 'Copy'}
        </button>
    </div>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="wk-code-scroll" tabindex="0" role="region" aria-label={regionLabel}>
        <pre data-language="html" class="vstack mb-0">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -- highlighted is the output of hljs which sanitizes the code argument -->
            <code class="hljs">{@html highlighted}</code>
        </pre>
    </div>
</div>

<style>
    .wk-code-example {
        background: var(--wk-code-bg, #fff);
        border-color: var(--wk-border, rgba(108, 117, 125, 0.2)) !important;
        overflow: hidden;
    }

    .wk-code-toolbar {
        align-items: center;
        background: var(--wk-code-toolbar-bg, #f8f9fa);
        border-bottom: 1px solid var(--wk-border, rgba(108, 117, 125, 0.2));
        display: flex;
        justify-content: flex-end;
        padding: 0.45rem 0.6rem;
    }

    .wk-code-scroll {
        background: var(--wk-code-bg, #fff);
        overflow: auto;
        scrollbar-color: var(--wk-border-strong, rgba(108, 117, 125, 0.28)) var(--wk-code-bg, #fff);
    }

    :global(.wk-code-scroll pre) {
        overflow: visible !important;
    }

    .wk-code-scroll:focus {
        outline: 0.2rem solid rgba(13, 110, 253, 0.35);
        outline-offset: -0.2rem;
    }

    :global(.wk-code-scroll code.hljs) {
        background: var(--wk-code-bg, #fff) !important;
        color: var(--wk-code-color, #172033) !important;
        font-size: 0.75rem !important;
        overflow: visible !important;
    }

    :global([data-bs-theme='dark'] .wk-code-example .btn-outline-secondary) {
        --bs-btn-color: #dbeafe;
        --bs-btn-border-color: #64748b;
        --bs-btn-hover-bg: #334155;
        --bs-btn-hover-border-color: #94a3b8;
        --bs-btn-hover-color: #ffffff;
        --bs-btn-active-bg: #475569;
        --bs-btn-active-border-color: #94a3b8;
        --bs-btn-active-color: #ffffff;
    }

    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-comment),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-quote) {
        color: #94a3b8 !important;
    }

    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-keyword),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-selector-tag),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-subst) {
        color: #c4b5fd !important;
    }

    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-string),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-attr),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-symbol),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-bullet),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-addition) {
        color: #86efac !important;
    }

    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-title),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-section),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-name),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-selector-id),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-selector-class) {
        color: #93c5fd !important;
    }

    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-number),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-literal),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-variable),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-template-variable),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-type) {
        color: #fbbf24 !important;
    }

    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-built_in),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-builtin-name),
    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-tag) {
        color: #67e8f9 !important;
    }

    :global([data-bs-theme='dark'] .wk-code-scroll .hljs-deletion) {
        color: #fca5a5 !important;
    }
</style>
