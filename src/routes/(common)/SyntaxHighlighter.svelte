<script lang="ts">
    import hljs from 'highlight.js/lib/core';
    import css from 'highlight.js/lib/languages/css';
    import javascript from 'highlight.js/lib/languages/javascript';
    import xml from 'highlight.js/lib/languages/xml';
    import stackoverflowLight from 'svelte-highlight/styles/stackoverflow-light';

    let { code }: { code: string } = $props();

    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('css', css);

    let highlighted = $derived.by(() => hljs.highlightAuto(code).value);
</script>

<svelte:head>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- stackoverflowLight is a static stylesheet bundled at compile time, not user input -->
    {@html stackoverflowLight}
</svelte:head>

<pre data-language="html" class="border rounded vstack mb-0">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- highlighted is the output of hljs which sanitizes the code argument -->
    <code class="hljs">{@html highlighted}</code>
</pre>

<style>
    pre > code {
        font-size: 0.75rem !important;
    }
</style>
