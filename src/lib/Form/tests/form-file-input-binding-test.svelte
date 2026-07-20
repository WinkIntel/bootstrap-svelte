<script lang="ts">
    import FileInput from '../form-file-input.svelte';

    let files = $state<FileList | null>(null);
    let callbackObservedName = $state('not-called');
    let replacementFiles = $state<FileList | null>(null);
</script>

<FileInput bind:files data-testid="file-input" onchange={() => (callbackObservedName = files?.[0]?.name ?? 'none')} />
<input data-testid="replacement-file-source" onchange={(event) => (replacementFiles = event.currentTarget.files)} type="file" />
<button data-testid="set-files" onclick={() => (files = replacementFiles)}>Set files</button>
<button data-testid="clear-files" onclick={() => (files = null)}>Clear files</button>
<button data-testid="set-malformed-files" onclick={() => (files = [] as unknown as FileList)}>Set malformed files</button>
<output data-testid="bound-file-name">{files?.[0]?.name ?? 'none'}</output>
<output data-testid="callback-file-name">{callbackObservedName}</output>
