<script lang="ts">
    let { group, defaultChecked }: { group?: string; defaultChecked?: boolean } = $props();
</script>

<form>
    <input {...{ defaultChecked }} bind:group type="radio" name="choices" value="a" />
    <input bind:group type="radio" name="choices" value="b" />
</form>
