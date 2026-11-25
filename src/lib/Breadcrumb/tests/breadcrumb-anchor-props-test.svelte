<script lang="ts">
    import { Breadcrumb } from '$lib/index.js';
    import type { HTMLAnchorAttributes } from 'svelte/elements';

    let { anchorProps, isActive = false, href }: { anchorProps?: HTMLAnchorAttributes; isActive?: boolean; href?: string } = $props();
</script>

<Breadcrumb.Root>
    <Breadcrumb.Item {href} {isActive} {anchorProps} class="item-class" data-testid="item">Library</Breadcrumb.Item>
</Breadcrumb.Root>
