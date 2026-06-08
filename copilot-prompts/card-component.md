# Card Component

Create a **Card component** (located: `src/lib/Card`) encapsulating all the features of the Bootstrap [Card component](https://getbootstrap.com/docs/5.3/components/card/).

### Requirements:

- Compose component parts using dot notation (`Card.Root`, `Card.Body`, etc.), similar to the existing Accordion component (`src/lib/Accordion`).
- Follow the Accordion component patterns, including `index.ts`, `types.ts`, `composition.ts`.
- Exclude `states.ts` as the Card component has no behaviors (no state management or animations required).
- Include a unit test (`card.svelte.test.ts`) within the Card folder, using Accordion tests as reference.
