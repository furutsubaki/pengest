<script lang="ts">
export let value: boolean;
export let variant:
| 'primary'
| 'secondary'
| 'info'
| 'success'
| 'warning'
| 'danger' = 'primary';
</script>

<label class="toggle {variant}" class:is-active={value}>
    <input type="checkbox" bind:checked={value} hidden />
</label>

<style lang="scss">
.toggle {
    display: grid;
    grid-template-columns: 0fr 1fr 1fr;
    width: 4em;
    height: 2em;
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--color-theme-border);
    border-radius: 16px;
    transition: grid 0.2s, border-color 0.2s, background-color 0.2s;
    &.is-active {
        grid-template-columns: 1fr 1fr 0fr;
        background-color: var(--color-theme-active);
        border: 1px solid var(--color-theme-active);
        &::before {
            // right: 0;
        }
    }
    &::before {
        grid-column: 2;
        content: '';
        background-color: var(--color-theme-text-primary);
        border-radius: 100%;
        transition: background-color 0.2s;
    }
}
</style>
