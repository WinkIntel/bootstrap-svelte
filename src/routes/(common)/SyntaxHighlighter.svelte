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
        <button class="btn btn-sm btn-outline-dark" type="button" onclick={copyCode} aria-label={`Copy ${label.toLowerCase()}`}>
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
        background: #fff;
        overflow: hidden;
    }

    .wk-code-toolbar {
        align-items: center;
        background: #f8f9fa;
        border-bottom: 1px solid rgba(108, 117, 125, 0.2);
        display: flex;
        justify-content: flex-end;
        padding: 0.45rem 0.6rem;
    }

    .wk-code-scroll {
        overflow: auto;
    }

    :global(.wk-code-scroll pre) {
        overflow: visible !important;
    }

    .wk-code-scroll:focus {
        outline: 0.2rem solid rgba(13, 110, 253, 0.35);
        outline-offset: -0.2rem;
    }

    :global(.wk-code-scroll code.hljs) {
        font-size: 0.75rem !important;
        overflow: visible !important;
    }
</style>
