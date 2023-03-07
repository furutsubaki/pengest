<form class="form-group">
    <table class="form-group-table">
        <tbody class="form-group-tbody">
            <slot />
        </tbody>
    </table>
</form>

<style lang="scss">
.form-group {
    .form-group-table {
        table-layout: fixed;
        width: 100%;
        .form-group-tbody {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
    }
}
</style>
