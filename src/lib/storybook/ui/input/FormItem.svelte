<script lang="ts">
export let label = '';
export let labelWidth = '160px';
</script>

<tr>
    <td class="label" style:--width={labelWidth}>{label}</td>
    <td><slot /></td>
</tr>

<style lang="scss">
.label {
    width: var(--width);
}
</style>
