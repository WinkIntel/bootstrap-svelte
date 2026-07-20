<script lang="ts">
    import { ProgressBar, ProgressStacked } from '../index.js';
</script>

<ProgressStacked data-testid="stacked-progress">
    <ProgressBar data-testid="stacked-first" valueNow={25} backgroundColorVariant="success" />
    <ProgressBar data-testid="stacked-second" valueNow={10} valueMin={5} valueMax={15} backgroundColorVariant="warning" />
</ProgressStacked>
