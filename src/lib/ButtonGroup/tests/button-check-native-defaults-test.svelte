<script lang="ts">
    let group = $state('b');
    const defaults = { defaultChecked: true };
    const noDefaults = {};
</script>

<form>
    <input {...defaults} bind:group defaultChecked={defaults.defaultChecked} name="choices" type="radio" value="a" />
    <input {...noDefaults} bind:group defaultChecked={false} name="choices" type="radio" value="b" />
</form>
