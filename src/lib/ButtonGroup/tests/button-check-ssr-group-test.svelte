<script lang="ts">
    import ButtonCheck from '../button-check.svelte';
    let { group, checked, defaultChecked }: { group?: string | null; checked?: boolean; defaultChecked?: boolean } = $props();
</script>

<form>
    <ButtonCheck type="radio" name="choices" value="a" {group} {checked} {defaultChecked}>A</ButtonCheck>
    <ButtonCheck type="radio" name="choices" value="b" {group}>B</ButtonCheck>
</form>
