<h2 class="h2">
    <slot />
</h2>

<style lang="scss">
.h2 {
    display: flex;
    gap: 8px;
    width: fit-content;
    padding: 4px 16px;
    padding-left: 16px;
    border-left: 4px solid var(--color-theme-text-primary);
    transition: border 0.2s;
}
</style>
