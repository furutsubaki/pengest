<script lang="ts">
export let value: string;
export let maxLength: number;
</script>

<div class="counter">
    {value.length}/{maxLength}
</div>

<style lang="scss">
.counter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    font-size: var(--font-size-small);
}
</style>
