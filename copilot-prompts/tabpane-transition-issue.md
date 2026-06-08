# Tab Pane Transition Issue

Resolve animation conflicts in `tab-pane.svelte`.

### Issue Description:

- Svelte DOM manipulation triggers simultaneous intro/outro transitions.
- Add a 150ms delay before inserting the incoming pane into DOM to allow outro completion of the previous pane.
- Immediate removal for outgoing panes without delay.

### Technical Considerations:

- Manage `isActiveState` carefully to handle delayed DOM insertions.
