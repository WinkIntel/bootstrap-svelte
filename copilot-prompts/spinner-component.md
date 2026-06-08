# Spinner Component

Create a **Spinner component** (`src/lib/Spinner`) encapsulating Bootstrap [Spinner features](https://getbootstrap.com/docs/5.3/components/spinners/).

### Requirements:

- Follow structural patterns from the Button component (`src/lib/Button`).
- Include properties:
  - `type` (`'border'` | `'grow'`, default: `'border'`).
  - `variant` (Bootstrap text color classes).
  - `size` (Bootstrap breakpoint names, default undefined).
- Exclude `visually-hidden` and placement; client manages these externally.
- Unit test (`spinner.svelte.test.ts`) referencing Button tests.
