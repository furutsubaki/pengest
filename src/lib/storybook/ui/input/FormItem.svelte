<script lang="ts">
export let label = '';
export let labelWidth = '160px';
</script>

<tr class="item">
    <td class="label" style:--width={labelWidth}>{label}</td>
    <td class="value"><slot /></td>
</tr>

<style lang="scss">
td {
    padding: 0;
    margin: 0;
    border: 0;
}

.item {
    display: flex;
}

.label {
    flex-shrink: 0;
    width: var(--width);
}

.value {
    display: flex;
    flex: 1;
    gap: 24px;
}
</style>
