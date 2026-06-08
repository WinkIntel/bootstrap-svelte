<!--
@component
## ProgressBar
A visual indicator component that displays progress towards completion of a task or operation.
Supports percentage-based progress visualization with customizable styling, theming, and accessibility attributes.

@example
```svelte
<ProgressBar valueNow={60} />
```

### Variants
```svelte
<ProgressBar valueNow={25} backgroundColorVariant="success" />
<ProgressBar valueNow={50} backgroundColorVariant="info" />
<ProgressBar valueNow={75} backgroundColorVariant="warning" />
<ProgressBar valueNow={100} backgroundColorVariant="danger" />

<ProgressBar valueNow={25}>25%</ProgressBar>

<ProgressStacked>
    <ProgressBar valueNow={30} backgroundColorVariant="success" />
    <ProgressBar valueNow={20} backgroundColorVariant="warning" />
</ProgressStacked>
```
### Props
- `ariaLabel` (string): Accessible label for screen readers. Defaults to 'Progress Bar'.
- `backgroundColorVariant` (string): Bootstrap color variant for the progress bar (primary, success, warning, etc.).
- `barProps` (object): Additional props to pass to the inner progress bar element.
- `class` (string): Additional CSS classes to apply to the progress container.
- `elementRef` (HTMLDivElement): Reference to the underlying DOM element.
- `style` (string): CSS styles to apply to the progress container.
- `valueMax` (number): Maximum value for the progress bar. Defaults to 100.
- `valueMin` (number): Minimum value for the progress bar. Defaults to 0.
- `valueNow` (number): Current progress value. Defaults to 0.
-->
<script lang="ts">
    import { fromStyle, toStyle, uniqueClsx, type CSSProperties } from '$lib/common/css.js';
    import type { ProgressProps } from './index.js';
    import { initProgressState, ProgressState } from './progress.svelte.js';

    let {
        ariaLabel = 'Progress Bar',
        backgroundColorVariant,
        children,
        class: classValues,
        barProps = {},
        elementRef = $bindable(null),
        style,
        valueMax = 100,
        valueMin = 0,
        valueNow = 0,
        ...restOfProps
    }: ProgressProps = $props();
    let { class: barClassValues, isAnimated = false, isStriped = false, style: barStyle, ...restOfBarProps } = $derived(barProps);

    // Initialize state and detect if this progress bar is part of a stacked container
    const barState: ProgressState = initProgressState({
        get barProps() {
            return barProps;
        }
    });

    // Determine where to apply width - when in a stacked layout, width is on the root element,
    // otherwise it's applied to the inner bar element
    let widthPlacement = $derived(barState.isStacked ? 'root' : 'bar');

    // Root element...
    let classes: string = $derived(uniqueClsx('progress', classValues));

    // Conditionally apply width to the root element's style if this bar is part of a stacked layout
    let styles: string | null | undefined = $derived.by(() => {
        if (widthPlacement === 'root') {
            let cssProps: CSSProperties = fromStyle(style);
            return toStyle({
                ...cssProps,
                width: `${valueNow}%`
            });
        }
        return style;
    });

    // Bar element...
    // Apply styles and classes to the inner bar element...
    let barClasses: string = $derived(
        uniqueClsx(
            'progress-bar',
            backgroundColorVariant && `bg-${backgroundColorVariant}`,
            {
                'progress-bar-animated': isAnimated,
                'progress-bar-striped': isStriped
            },
            barClassValues
        )
    );

    // Apply width to the inner bar element when not in a stacked layout
    let barStyles: string | null | undefined = $derived.by(() => {
        if (widthPlacement === 'bar') {
            let cssProps: CSSProperties = fromStyle(barStyle);
            return toStyle({
                ...cssProps,
                width: `${valueNow}%`
            });
        }
        return barStyle;
    });

    // Apply Bootstrap's theme attribute for proper text contrast on dark backgrounds
    // This ensures text remains visible when placed inside colored progress bars
    let theme = $derived.by(() => {
        const darkVariants = ['dark', 'primary', 'secondary', 'success', 'danger'];
        return darkVariants.includes(backgroundColorVariant ?? '') ? 'dark' : undefined;
    });
</script>

<div
    aria-label={ariaLabel}
    aria-valuemax={valueMax}
    aria-valuemin={valueMin}
    aria-valuenow={valueNow}
    bind:this={elementRef}
    class={classes}
    role="progressbar"
    style={styles}
    {...restOfProps}>
    <div class={barClasses} data-bs-theme={theme} style={barStyles} {...restOfBarProps}>
        {@render children?.()}
    </div>
</div>
