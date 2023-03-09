<table class="form-group-table">
    <tbody class="form-group-tbody">
        <slot />
    </tbody>
</table>

<style lang="scss">
.form-group-table {
    width: 100%;
    table-layout: fixed;
    .form-group-tbody {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
}
</style>
