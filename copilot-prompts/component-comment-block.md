# Copilot Prompt: Add `@component` Comment Blocks to Form Components

## Goal

Update each of the `form-*.svelte` component source files in the `src/lib/Form` directory to include a structured comment block using the `@component` tag.

## Requirements

- **Placement:**
  Insert the comment immediately **after the closing `</script>` tag** and **before the HTML markup begins**.

- **Format:**
  Use the comment block format found in the `pagination.svelte` component as your reference for structure and syntax.

- **Content:**
  Use the examples from `+page.svelte` to populate realistic and thorough usage examples in the comment block. These examples already showcase comprehensive usage of the `form-*.svelte` components.

- **Props Documentation:**
  Include a `### Props` section in the comment block to list and briefly describe each supported prop.

## Example Structure

Your comment block should follow this pattern:

```svelte
<!--
@component
## Form.Input
Input field for standard text values with support for type, label, and validation messaging.

@example
```svelte
<Form.Input
　　id=\"email\"
　　label=\"Email Address\"
　　type=\"email\"
　　bind:value={form.email}
　　error={errors.email}
/>

### Props
- id (string): Unique identifier for the input element.
- label (string): Optional label text displayed above the input.
- type ('text' | 'email' | 'password' | ...): Type of input; defaults to 'text'.
- value (string): Two-way bound input value.
- error (string): Optional error message displayed below the input.
-->

> Note: Be consistent across all `form-*.svelte` files. Use the specific component name (e.g., `Form.Select`, `Form.TextArea`) in the comment header.

## Reference Files

- Examples source: `+page.svelte`
- Comment format example: `pagination.svelte`
- Target directory: `src/lib/Form`
