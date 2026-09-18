<script lang="ts">
    import { collapseAria } from '../index.js';

    let {
        enabled = true,
        target = 'panel-one',
        expanded = false,
        consumerControls,
        consumerExpanded,
        consumerRole
    }: {
        enabled?: boolean;
        target?: string;
        expanded?: boolean;
        consumerControls?: string;
        consumerExpanded?: 'true' | 'false';
        consumerRole?: string;
    } = $props();
</script>

<button
    data-testid="control"
    aria-controls={consumerControls}
    aria-expanded={consumerExpanded}
    role={consumerRole}
    {@attach enabled && collapseAria({ ariaControls: target, ariaExpanded: expanded })}>Toggle</button>
